from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone
from typing import Annotated, Optional
from database import get_db
from models import Users
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError

# Router containing account and authentication endpoints.
router = APIRouter()

# Configure password hashing and bearer-token authentication.
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
OAuth2_bearer = OAuth2PasswordBearer(tokenUrl='login')

# Secret and algorithm used to sign JSON Web Tokens.
SECRET_KEY ='86746eeb8285ca279c6251e0bd83cdd50c88027b934a93f19d8b9af782139516'
ALGORITHM = 'HS256' 

# Request data required when creating a user.
class CreateUsers(BaseModel):
    email : str
    username : str
    firstname : str
    lastname : str
    password : str
    role : str

# Optional profile fields accepted during a user update.
class UpdateUser(BaseModel):
    email : Optional[str] = Field(default=None)
    username : Optional[str] = Field(default=None)
    firstname : Optional[str] = Field(default=None)
    lastname : Optional[str]= Field(default=None)

# Password fields accepted when changing a password.
class UpdatePassword(BaseModel):
    current_password : str
    new_password: str


# Find a user and verify the supplied password.
def authenticate_user(username, password, db):
    user = db.query(Users).filter(Users.username == username).first()
    if user is None:
        return False
    if bcrypt_context.verify(password, user.hash_password):
        return user
    return False

# Create a signed access token containing the user's identity and role.
def create_access_token(user, expires_delta: timedelta):
    encode = {
        'sub': user.username,
        'id': user.id,
        'role': user.role,
        'email': user.email,
        'firstname': user.firstname,
        'lastname': user.lastname
    }
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})

    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

# Decode the bearer token and return the authenticated user's claims.
def get_current_user(token: Annotated[str, Depends(OAuth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        role: str = payload.get('role')
        if username is None or user_id is None:
            raise HTTPException(status_code=404, detail='User not found')
        return {
            'username': username,
            'id': user_id,
            'role': role,
            'email': payload.get('email'),
            'firstname': payload.get('firstname'),
            'lastname': payload.get('lastname')
        }
    except JWTError as e:
        print(e)
        raise HTTPException(status_code=401, detail='Invalid token')

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

# Create a user with a hashed password.
@router.post('/createuser')
def create_users(db : db_dependency, new_user : CreateUsers):
    user_model = Users(
        email = new_user.email,
        username = new_user.username,
        firstname = new_user.firstname,
        lastname = new_user.lastname,
        hash_password = bcrypt_context.hash(new_user.password),
        is_active = True,
        role = new_user.role
    )

    db.add(user_model)
    db.commit()

    return JSONResponse(status_code=201, content={'message' : 'User created successfully'})

# Authenticate a user and return a short-lived access token.
@router.post('/login')
def login_user(db : db_dependency, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    
    user = authenticate_user(form_data.username, form_data.password, db) 
    if user is False:
        raise HTTPException(status_code=401, detail="Failed authentication")
    token = create_access_token(user,timedelta(minutes=30))
    return {'access_token': token, 'token_type': 'bearer'}


# Update the authenticated user's supplied profile fields.
@router.put('/edituser')
def update_user(user: user_dependency, db : db_dependency, update_user : UpdateUser):

    if user is None: 
        raise HTTPException(status_code=401, detail='Failed Authentication')
    user = db.query(Users).filter(Users.id == user.get('id')).first()
    
    update_data = update_user.model_dump(exclude_unset=True)

    for key,value in update_data.items():
        setattr(user,key,value)
    
    db.commit()
    return JSONResponse(status_code=200, content={'message' : 'User updated successfully'})


# Verify the current password before saving its replacement.
@router.put('/passwordchange')
def update_password(user: user_dependency, db : db_dependency, update_password : UpdatePassword):

    if user is None: 
        raise HTTPException(status_code=401, detail='Failed Authentication')
    
    user = db.query(Users).filter(Users.id == user.get('id')).first()
    
    if not bcrypt_context.verify(update_password.current_password, user.hash_password):
        raise HTTPException(status_code=401, detail='Wrong Password')

    user.hash_password = bcrypt_context.hash(update_password.new_password)

    db.add(user)
    db.commit()
    return JSONResponse(status_code=200, content={'message' : 'Password updated successfully'})
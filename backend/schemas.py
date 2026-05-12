from pydantic import BaseModel 
from datetime import date 
from typing import Optional

class JobCreate(BaseModel):
    company: str
    role: str 
    status: str
    date_applied: Optional[date] = None
    notes: Optional[str] = None

class JobResponse(BaseModel):
    id: int
    company: str
    role: str
    status: str
    date_applied: Optional[date] = None
    notes: Optional[str] = None

    class Config: 
        from_attributes = True
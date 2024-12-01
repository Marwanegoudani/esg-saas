"""add company description and highlights

Revision ID: add_company_description
Revises: 
Create Date: 2024-03-12

"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Add new columns
    op.add_column('company', sa.Column('description', sa.Text(), nullable=True))
    op.add_column('company', sa.Column('environmental_highlight', sa.Text(), nullable=True))
    op.add_column('company', sa.Column('social_highlight', sa.Text(), nullable=True))
    op.add_column('company', sa.Column('governance_highlight', sa.Text(), nullable=True))

def downgrade():
    # Remove columns if needed to rollback
    op.drop_column('company', 'description')
    op.drop_column('company', 'environmental_highlight')
    op.drop_column('company', 'social_highlight')
    op.drop_column('company', 'governance_highlight')
from flask import current_app
from alembic import context
from app import create_app, db

# This is the Alembic Config object
config = context.config

# Add your model's MetaData object here for 'autogenerate' support
target_metadata = db.metadata

def run_migrations_online():
    """Run migrations in 'online' mode."""
    app = create_app()
    
    with app.app_context():
        with db.engine.connect() as connection:
            context.configure(
                connection=connection,
                target_metadata=target_metadata
            )

            with context.begin_transaction():
                context.run_migrations()
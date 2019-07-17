# Database migration scripts

Add new migrations with the filename format of the current version
followed by a description of the migration being performed.

Note that migration scripts are not transpiled with Babel. This could be
addressed by introducing a custom resolver in `db-migrate.js`.

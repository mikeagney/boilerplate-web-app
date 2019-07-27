# Database migration scripts

Add new migrations with the filename format of the date at which the
migration was created (without dashes), followed by the new version of
the schema, followed by a description of the migration being performed.
For example:

`20190726-0.0.2-new-migration-description.js`

Note that migration scripts are not transpiled with Babel. This could be
addressed by adding Babel to the runtime dependencies if there is a
compelling case for doing so.

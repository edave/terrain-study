# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_map-experiment_session',
  :secret      => 'a557fe1def867e2126fa4d05c82f7e61e6eb0b41b29f5021bf925dfad94f5e2f40d94e51e6551112034b2fe254e355a130bfb3a42ca4318d7073b6fad98cfdfb'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store

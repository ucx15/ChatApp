print("Backend:\n")

BK_PORT = input("PORT: ")
MONOGO_URI = input("MONGO_URI: ")
SALT_ROUNDS = input("SALT_ROUNDS: ")
# JWT_SECRET = input("JWT_SECRET: ")


print("\nFrontend:\n")

FRONTEND_PORT = input("PORT: ")

with open("Backend/.env", "w") as f:
	f.write(f"PORT={BK_PORT}\n")
	f.write(f"MONGO_URI={MONOGO_URI}\n")
	# f.write(f"SECRET_KEY={JWT_SECRET}\n")
	f.write(f"SALT_ROUNDS={SALT_ROUNDS}\n")

with open("Frontend/.env", "w") as f:
	f.write(f"PORT={FRONTEND_PORT}\n")

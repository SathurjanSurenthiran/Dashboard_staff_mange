package utils

import "golang.org/x/crypto/bcrypt"

// HashPassword hashes a plain-text password with bcrypt.
func HashPassword(plain string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPassword compares a plain-text password against a bcrypt hash.
func CheckPassword(plain, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(plain)) == nil
}

FROM golang:1.20

# Install air for hot reloading
RUN go install github.com/cosmtrek/air@v1.42.0

WORKDIR /app

# Copy source code
COPY . .

# Run air for hot reloading
CMD ["air", "-c", ".air.toml"]

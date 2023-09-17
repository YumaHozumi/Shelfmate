FROM golang:1.20 AS build
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN go build -o main .

FROM debian:buster-slim
WORKDIR /app
RUN apt update && apt install -y ca-certificates
COPY --from=build /app/main .
CMD ["./main"]

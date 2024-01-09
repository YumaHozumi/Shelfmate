# Build stage
FROM golang:1.20 AS build
WORKDIR /app
COPY ./go.mod ./go.sum ./
RUN go mod download
COPY ./ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /main

# Deploy stage
FROM debian:buster-slim
WORKDIR /app
RUN apt update && apt install -y ca-certificates
COPY --from=build /main /main
CMD ["/main"]
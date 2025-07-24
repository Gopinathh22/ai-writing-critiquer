# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
# The requirements.txt is in the build context (./backend)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the application code into the /app directory
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Run uvicorn pointing to the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"] 
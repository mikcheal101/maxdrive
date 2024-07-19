# Tasks
Design and implement a real-time collaborative text editor that allows multiple users to
simultaneously edit a document. The editor should provide a seamless and responsive editing
experience, handling concurrent updates and maintaining document consistency.
Packaged the application into a Docker Compose environment.

### Requirements
1. API Endpoints:
   - POST `/api/documents`: Create a new document and return its unique identifier.
   - GET `/api/documents/:id`: Retrieve the content of a specific document.
   - WS `/api/documents/:id`: Establish a WebSocket connection for real-time collaboration on a document.
2. Real-time Collaboration:
   - Users should be able to connect to a document using WebSocket and start editing in real time.
   - Changes made by one user should be instantly visible to all other connected users.
   - Implement Operational Transformation *(OT)* or Conflict-free Replicated Data Type *(CRDT)* algorithms to handle concurrent edits and ensure document consistency.
3. Document Persistence:
   - Store document content in a database for persistence across sessions.

import request from "supertest";
import Application from "../application";
import DocumentDto from "../models/document.dto";
import { v4 as uuid } from "uuid";

describe("Express Application", () => {

    // it should return a uuid
    it("should return a uuid", async () => {
        const response = await request(Application).post(`/api/documents`).send();

        const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        const data: {id: string} = response.body;

        expect(response.status).toBe(200);
        expect(data.id.match(regex)).not.toBeNull();
    });

    // it should return the content of the file
    it("should return the contents of the given file", async () => {

        // create file
        const _uuid: string = uuid();
        const _expectedContent: string = "Hello dear <b>friends</b>";
        const _document = await DocumentDto.Save({
            uuid: _uuid,
            content: _expectedContent
        });

        const response = await request(Application).get(`/api/documents/${_uuid}`).send();
        const data = response.body;

        
        expect(response.status).toBe(200);
        expect(data).not.toBeNull();
        expect(_document).not.toBe(null);
        expect(_document).not.toBe(undefined);
    });
});
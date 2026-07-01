from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.responses import JSONResponse
from agent.agentic_workflow import GraphBuilder
from utils.save_to_document import save_document, save_document_as_pdf
import os
import traceback
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()



app = FastAPI()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


class PdfRequest(BaseModel):
    content: str


@app.post("/query")
async def query_travel_agent(query: QueryRequest):
    try:
        print(query)
        graph = GraphBuilder(model_provider="groq")
        react_app = graph()
        # react_app = graph.build_graph()

        png_graph = react_app.get_graph().draw_mermaid_png()
        with open("my_graph.png", "wb") as f:
            f.write(png_graph)

        print(f"Graph saved as 'my_graph.png' in {os.getcwd()}")
        # Assuming request is a pydantic object like: {"question": "your text"}
        messages = {"messages": [query.question]}
        output = react_app.invoke(messages)

        # If result is dict with messages:
        if isinstance(output, dict) and "messages" in output:
            final_output = output["messages"][-1].content  # Last AI response
        else:
            final_output = str(output)

        return {"answer": final_output}
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/query/pdf")
async def download_travel_plan_pdf(payload: PdfRequest):
    try:
        filepath = save_document_as_pdf(payload.content)
        if not filepath:
            return JSONResponse(status_code=500, content={"error": "Failed to generate PDF"})

        return FileResponse(
            path=filepath,
            media_type="application/pdf",
            filename=os.path.basename(filepath),
        )
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
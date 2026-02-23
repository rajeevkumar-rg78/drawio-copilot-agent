from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
import os, json, base64
from xml.sax.saxutils import escape
from openai import OpenAI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.diagrams.net"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def ir_to_drawio_xml(ir):
    nodes = ir["nodes"]
    edges = ir["edges"]

    x_center = 425
    node_w, node_h, v_gap, top_y = 360, 70, 40, 80

    pos = {}
    for i, n in enumerate(nodes):
        x = int(x_center - node_w/2)
        y = int(top_y + i*(node_h+v_gap))
        pos[n["id"]] = (x,y,node_w,node_h)

    xml = []
    xml.append('<mxfile host="app.diagrams.net">')
    xml.append('<diagram name="Copilot Agent Flowchart">')
    xml.append('<mxGraphModel><root>')
    xml.append('<mxCell id="0"/>')
    xml.append('<mxCell id="1" parent="0"/>')

    for n in nodes:
        nid = escape(n["id"])
        text = escape(n["text"])
        x,y,w,h = pos[n["id"]]
        xml.append(f'<mxCell id="{nid}" value="{text}" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">')
        xml.append(f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/>')
        xml.append('</mxCell>')

    for i, e in enumerate(edges, start=1):
        xml.append(f'<mxCell id="e{i}" edge="1" parent="1" source="{e["from"]}" target="{e["to"]}">')
        xml.append('<mxGeometry relative="1" as="geometry"/>')
        xml.append('</mxCell>')

    xml.append('</root></mxGraphModel></diagram></mxfile>')
    return "\n".join(xml)

def parse_image(image_bytes, content_type):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    data_url = "data:image/png;base64," + base64.b64encode(image_bytes).decode()

    resp = client.responses.create(
        model="gpt-5",
        input=[{
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Extract flowchart as JSON with nodes and edges."},
                {"type": "input_image", "image_url": data_url}
            ]
        }]
    )

    text = resp.output[0].content[0].text
    return json.loads(text)

@app.post("/image-to-drawio")
async def image_to_drawio(image: UploadFile = File(...)):
    if image.content_type not in ("image/png","image/jpeg"):
        raise HTTPException(status_code=415)

    img_bytes = await image.read()
    ir = parse_image(img_bytes, image.content_type)
    xml = ir_to_drawio_xml(ir)

    return Response(
        content=xml,
        media_type="application/xml",
        headers={"Content-Disposition": 'attachment; filename="copilot.drawio"'}
    )

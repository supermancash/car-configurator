
let uniData = [];

export default async function handler(req, res) {

  if(req.method==="POST") {
    console.log("POST!!!!!")
    const data = await req.body;
    console.log(data);

    const index = uniData.findIndex(el => el.sessionid = data.sessionid);
    if (index > -1) uniData.splice(index, 1);
    uniData.push(data);
    res.status(200).json({ ok: true })
  }

  const response = uniData.some(el =>el.sessionid = req.cookies.sessionid) ?
      uniData.filter(el =>el.sessionid = req.cookies.sessionid)[0] : {}

  if(req.method==="GET") res.status(200).json(response)

}

export const getUniData = () => uniData;

import { recordCollection } from "../database/db.js";

export async function postRecordsEntry(req, res) {
  const record = req.body;

  try {
    const user = res.locals.user;

    let data = new Date();
    data = `${data.getDate()}/${data.getMonth() + 1}`;
    await recordCollection.insertOne({
      value: record.value,
      description: record.description,
      typeRecord: "E",
      //userId: session.userId,
      userId: user._id,
      data: data,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
}

export async function postRecordsExit(req, res) {
  const record = req.body;

  try {
    const user = res.locals.user;

    let data = new Date();
    data = `${data.getDate()}/${data.getMonth() + 1}`;
    //console.log("data", data);
    await recordCollection.insertOne({
      value: record.value,
      description: record.description,
      typeRecord: "S",
      //userId: session.userId,
      userId: user._id,
      data: data,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
}

export async function getRecords(req, res) {
  let valueEntry = 0;
  let valueExit = 0;
  try {
    const user = res.locals.user;
    const records = await recordCollection
      //.find({ userId: session?.userId })
      .find({ userId: user._id })
      .toArray();

    function calculetSaldo(item) {
      if (item.typeRecord === "E") {
        valueEntry += Number(item.value);
      } else {
        valueExit += Number(item.value);
      }
    }

    //saldo a respeito dos valores de entrada e saída
    records.forEach(calculetSaldo);
    let saldo = (valueEntry - valueExit).toFixed(2);
    saldo = parseFloat(saldo);

    // Tirar o password, pois não é uma boa prática e tbm é uma camada a mais de segurança.
    delete user.password;

    res.send({ records, user, saldo });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
}

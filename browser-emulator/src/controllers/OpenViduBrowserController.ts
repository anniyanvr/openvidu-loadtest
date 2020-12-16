import * as express from 'express';
import { Request, Response } from 'express';
import { OpenViduRole } from 'openvidu-node-client';
import { OpenViduBrowser } from '../openvidu-browser/openvidu-browser';

export const app = express.Router({
    strict: true
});

const ovBrowser: OpenViduBrowser = new OpenViduBrowser();

app.post("/streamManager", async (req: Request, res: Response) => {
	try {
		const uid: string = req.body.uid;
		const sessionName: string = req.body.sessionName;
		const role: string = req.body.role;
		if(!uid || !sessionName){
			console.log(req.body);
			return res.status(400).send("Problem with some body parameter");
		}
		if(!!role && (role === OpenViduRole.PUBLISHER || role === OpenViduRole.SUBSCRIBER)) {
			await ovBrowser.createStreamManager(uid, sessionName, role);
		} else {
			return res.status(400).send("Problem with role body parameter. Must be 'PUBLISHER' or 'SUBSCRIBER'");
		}
		res.status(200).send('Created ' + role + ' ' +  uid + ' in session ' + sessionName);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.delete("/streamManager", (req: Request, res: Response) => {
	try {
		const uid: string = JSON.stringify(req.query.uid);
		const role: any = req.query.role;
		if(!uid && !role){
			return res.status(400).send("Problem with some query parameter");
		}

		if(!!uid) {
			console.log("Deleting streams with ID: " + uid);
			ovBrowser.deleteStreamManagerWithUid(uid);
		} else {
			console.log("Deleting streams with ROLES:" + role);
			ovBrowser.deleteStreamManagerWithRole(role);
		}
		res.status(200).send({});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});
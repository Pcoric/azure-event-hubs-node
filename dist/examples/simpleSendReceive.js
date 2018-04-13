"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const connectionString = "EVENTHUB_CONNECTION_STRING";
const entityPath = "EVENTHUB_NAME";
const str = process.env[connectionString] || "";
const path = process.env[entityPath] || "";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = lib_1.EventHubClient.createFromConnectionString(str, path);
        const sender = yield client.createSender("0");
        const ids = yield client.getPartitionIds();
        const hub = yield client.getHubRuntimeInformation();
        console.log(">>>> Hub: \n", hub);
        for (let i = 0; i < ids.length; i++) {
            console.log("***********Creating receiver %d", i);
            const receiver = yield client.createReceiver(ids[i], { eventPosition: lib_1.EventPosition.fromEnqueuedTime(Date.now()) });
            console.log("***********Created receiver %d", i);
            receiver.on("message", (eventData) => __awaiter(this, void 0, void 0, function* () {
                console.log(">>> EventDataObject: ", eventData);
                console.log("### Actual message:", eventData.body ? eventData.body.toString() : null);
                yield receiver.close();
            }));
        }
        sender.send({ body: "Hello awesome world!!" + new Date().toString() });
        yield sender.close();
    });
}
main().catch((err) => {
    console.log("error: ", err);
});
//# sourceMappingURL=simpleSendReceive.js.map
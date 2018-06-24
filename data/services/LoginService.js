var duong_dan_module_DL_mysql= '../data_table_mysql/';
const dataMobile = require(duong_dan_module_DL_mysql+"dataMobile");
const query = require('querystring');
const app = require('http');
const server_accounts_manager = require('../server_connection/server_accounts_manager');
const dataAccount = require('../data_table_mysql/dataAccount');

function loginFromAnotherServer(req, res, responseHeader, session_manager){
    var data = '';
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        var flagLoginAccount = false;
        var account = query.parse(data);
        console.log('**login server request', account);
        var sessionID = account.sessionID;
        if(sessionID){
            var indexSession = session_manager.isExistedKey(sessionID);
            if(indexSession != -1){
                var sessionAccount = session_manager.getSesionAt(indexSession);
                console.log('sessionAccount : ', sessionAccount);
                if(session_manager.isExpiredDate(sessionAccount.last_access, sessionAccount.time_out)){
                    flagLoginAccount = true;
                    console.log("expired");
                }else{
                    res.end(JSON.stringify({"sessionID" : sessionAccount.sessionID}));  
                }
            }else{
                flagLoginAccount = true;
            }
        }
        if(flagLoginAccount == true){
            res.writeHeader(200, responseHeader);
            if(server_accounts_manager.isExistedAccount(account.username, account.password)){
                var session = session_manager.insertNewConnection();
                res.end(JSON.stringify({"sessionID" : session}));               
            }else{
                res.end(JSON.stringify(session_manager.getLoginError()));
                console.log("Account login is not existed!");
            }
        }
    });
}

function loginUser(req, res, responseHeader, session_manager){
    var data = '';
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        var dataRequest = query.parse(data);
        console.log('**login server request', dataRequest);
        var sessionID = dataRequest.sessionID;
        res.writeHeader(200, responseHeader);

        if(sessionID){
            var indexSession = session_manager.isExistedKey(sessionID);
            if(indexSession != -1){
                var sessionAccount = session_manager.getSesionAt(indexSession);
                console.log('sessionAccount : ', sessionAccount);
                // session hết hạn
                if(session_manager.isExpiredDate(sessionAccount.last_access, sessionAccount.time_out)){
                    flagLoginAccount = true;
                    console.log(`session: ${sessionID} expired!`);
                    res.end(JSON.stringify(session_manager.getExpiredError()));
                    // sesion còn hạn
                }else{
                    // 
                    res.end(JSON.stringify({"DATA SERVICE: " : "OK"}));  
                }
            }else{
                res.end(JSON.stringify(session_manager.getLoginError())); 
            }
        }
    });
}


module.exports = {
    loginFromAnotherServer : loginFromAnotherServer,
    loginUser : loginUser
}
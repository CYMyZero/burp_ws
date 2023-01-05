 var   ws = new WebSocket("ws://127.0.0.1:12000");
        //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
        ws.onopen = function(){
            //当WebSocket创建成功时，触发onopen事件
            console.log("websocket连接成功");
            //ws.send("hello"); //将消息发送到服务端
        }
        ws.onmessage = function(e){
            //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
            console.log("11111");
         try {
            message=JSON.parse(e.data);
            console.log(message);
            reqrep=JSON.parse(message.data);
            headers=reqrep.headers;
            bodys=reqrep.body;
            //console.log(reqrep);
            if(reqrep.state=="request"){
                 bodys=encodeURIComponent(bodys.replace(/(?<=req\=)(.*?)(?=&)/g,  window.CryptoJS.AES.encrypt(bodys.match("req=(.*?)&")[1],"groupappEncrypk1").toString()))
                //bodys={_text:window.enc(JSON.stringify(bodys),"u8rVhKLBTZck").toString()};
                //console.log(headers);
                //console.log(bodys);

            }else if(reqrep.state=="response"){
 
                //console.log(headers);
                console.log(bodys);
            }else{
                console.log("error!");
            }
            modify_data={
               "uid":message.uid,
               "data":JSON.stringify({
                  
                   "headers":headers,
                   "state":reqrep.state,
                   "body":reqrep.state=="request"?JSON.stringify(bodys):bodys
                   
               }),
               
            }
            console.log(modify_data);
            ws.send(JSON.stringify(modify_data))
         } catch (error) {
          
         }

        }
        ws.onclose = function(e){
            //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
            console.log("websocket已断开");
        }
        ws.onerror = function(e){
            //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
            console.log("websocket发生错误"+error);
        }

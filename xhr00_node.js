/*eslint-env node */

var myHttp = require('http');	/* http関連のモジュールを読み込む */
var myHttpF = require('fs');	/* ファイル関連モジュールを読み込む */

var myServer = myHttp.createServer();			/* webサーバオブジェクトを作る */
myServer.on('request', httpPrint);				/* requestが来たらhttpPrintを実行するように設定 */
myServer.listen(1024);							/* 指定ポートで待ち受け */
console.log('Server running at MY_SERVER.');	/* "MY_SERVERで待ってるぜ"とコンソールに表示 */

function httpPrint (request, response) {
/* リクエストに対してファイルを読み込んで送信する。 */

	console.log(request.url); /*リクエストURLをコンソールに表示 */

	/* とりあえず、リクエストされるURLは分かってるので、それ前提でリクエストURL毎の処理を書いた。
	 * 基本、リクエストURL毎にContentTypeを設定して、送信処理を呼び出している。
     */
    var murl = request.url.split("/");
	switch (murl[murl.length-1]) {
		case "xhr00.js":
			responseHttp(response, request.url, "application/javascript");
			break;
		case "xhr00.css":
			responseHttp(response, request.url, "text/css");
			break;
		case "xhr-test-text.js":
			responseXMLHttpReqT(response, "text/plane");
			break;
		case "xhr-test-image.js":
			responseXMLHttpReqI(response, "text/plane");
			break;
		default:
			/* 画像だけファイル中に番号が入ってるから別処理 */
			var mmurl = murl[murl.length-1].split(".");
			switch (mmurl[mmurl.length-1]) {
				case "png":
					responseHttpImage(response, request.url, "image/png");
					break;
				default:
				/* どれにも当てはまらないリクエストURLの処理 */
					responseHttp(response, "/xhr00.html", "text/html");
					break;
			}
			break;
	}
}

function responseXMLHttpReqT (response, contentType) {
/* XMLHTTPRequestに対してテキストを送信する。
 *	response   :レスポンスオブジェクト
 *	contentType:送信するデータのコンテントタイプ
 */
	response.writeHead(200, {'Content-Type': contentType});
	response.write("XMLHTTPRequestのテストです。");
	response.write("canvasをクリックしてください。");
	response.end();
}

/* Pingファイル名を作成する関数。
 * クロージャ使ってファイル名中の番号をカウントしてる。
 */
var PingFileName = (function () {
	var number = -1;
	return (function () {
		number++;
		if (4 < number) number = 0; 
		return ("/images/xhr0" + number.toString() + ".png");
	});
})();

function responseXMLHttpReqI (response, contentType) {
/* XMLHTTPRequestに対して画像ファイル名を応答する。
 *	response   :レスポンスオブジェクト
 *	contentType:送信するデータのコンテントタイプ
 */
	response.writeHead(200, {'Content-Type': contentType});
	response.write(PingFileName() /*"/images/xhr" + "00" + ".png"*/);
	response.end();
}

function responseHttp (response, url, contentType) {
/* hmtl、css、js の各ファイルを送信する。
 *	response   :レスポンスオブジェクト
 *	url        :ファイルのドキュメントルートからのURL
 *	contentType:送信するデータのコンテントタイプ
 */
	/* ファイルを読み込んで、status code と content type 設定してテキストデータを送信。 */
	myHttpF.readFile("./public" + url, 'UTF-8',
		function(err, data){
		/* ファイル読み込めた場合のコールバック関数 */
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
			response.end();
		});
}

function responseHttpImage (response, url, contentType) {
/* 画像ファイルを送信する。
 *	response   :レスポンスオブジェクト
 *	url        :ファイルのドキュメントルートからのURL
 *	contentType:送信するデータのコンテントタイプ
 */
	/* ファイルを読み込んで、status code と content type 設定して画像ファイルを送信。
	 * Base64でファイル読んで、Base64でResponseするんだねぇ、適当にやってちょっとはまった。
	 * httpを分かってない証拠だ…。
	 */
	myHttpF.readFile("." + url, "base64",
		function(err, data){
		/* ファイル読み込めた場合のコールバック関数 */
			if (err) {
				/* はまった時の名残。エラーになった時のerr表示処理 */
				console.log(err);
			} else {
				response.writeHead(200, {'Content-Type': contentType});
				response.write(data, "base64");
				response.end();
			}
		});
}

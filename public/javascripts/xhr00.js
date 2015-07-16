/*eslint-env browser */

/*
 * 読み込み完了したらinitial()呼ぶ
 */
window.addEventListener("load", initial);


var Canvas;
var textArea;

/*
 * XMLHttpRequest使ってサーバから文字列を受信し、canvasに描画する
 */
function initial() {
	Canvas = document.querySelector("#canvas");
	var cnvsCntxt = Canvas.getContext("2d");
	textArea = document.querySelector("#xhrState");

	cnvsCntxt.font = "bold 20pt 'arial'";
	cnvsCntxt.strokeStyle = "black";
	cnvsCntxt.strokeText("これからXMLHTTPRequestを使って通信します。", 20, 200);
	cnvsCntxt.strokeText("赤字で受信したデータを表示します。", 20, 240);

	/* XMLHTTPRequest 実行関数を呼び出す */
	XHReq(cnvsCntxt);
}


function XHReq (cnvsCntxt) {
	/* XMLHttpRequest オブジェクトを作成 */
	var xhr = new XMLHttpRequest();

	/*
	 *  通信状態が変化する度に表示する。
	 *  通信完了時は受信した文字列をcanvasに表示する(失敗は考慮してない)
	 */
	xhr.onreadystatechange = function () {
		switch(xhr.readyState){
			case 1:
				textArea.value = textArea.value + "open() メソッドの呼び出しが完了した\n\n";
				break;
			case 2:
				textArea.value = textArea.value + "レスポンスヘッダの受信が完了した\n\n";
				break;
			case 3:
				textArea.value = textArea.value + "レスポンスボディを受信中（繰り返し実行される）\n\n";
				break;
			case 4:
				textArea.value = textArea.value + "XHR 通信が完了した（成功失敗に関わらず）\n\n";
				cnvsCntxt.font = "bold 24pt 'arial'";
				cnvsCntxt.strokeStyle = "red";
				cnvsCntxt.strokeText(xhr.responseText, 20, 300);
				break;
		}
	};

	/* HTTPメソッド、アクセス先等、通信の設定を行う */
	var url = "http://localhost:1024/xhr-test.js";
	xhr.open("GET" , url, true);

	/* 通信開始 */
	xhr.send(null);
}

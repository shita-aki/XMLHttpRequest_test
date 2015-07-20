/*eslint-env browser */

/*
 * 読み込み完了したらinitial()呼ぶ
 */
window.addEventListener("load", initial);


/*
 * XMLHttpRequest使ってサーバから文字列を受信し、canvasに描画する
 */
function initial() {
	/* 各エレメントを設定 */
	var Canvas = document.querySelector("#canvas");
	var cnvsCntxt = Canvas.getContext("2d");
	var textArea = document.querySelector("#xhrState");

	/* XMLHttpRequestオブジェクトを定義 */
	var xhrText = new XMLHttpRequest();
	var xhrImage = new XMLHttpRequest();

	/* XMLHTTPRequestの設定 */
	XHReqT(xhrText, cnvsCntxt, textArea);

	cnvsCntxt.font = "bold 20pt 'arial'";
	cnvsCntxt.strokeStyle = "black";
	cnvsCntxt.strokeText("これからXMLHTTPRequestを使って通信します。", 20, 200);
	cnvsCntxt.strokeText("赤字で受信したデータを表示します。", 20, 240);

	/* canvas上でクリックされた時に実行する関数を定義する。 */
	Canvas.addEventListener("click", function (e) {
		// ブラウザ上のcanvasの座標を参照する。
		var rect = Canvas.getBoundingClientRect() ;
		var pX = rect.left ;
		var pY = rect.top ;

		// クリックされた時点のブラウザ上のマウスの位置と、上で参照したcanvasの座標から、
		// canvas上のマウスの座標を算出する。
		var oX = e.clientX - pX;
		var oY = e.clientY - pY;
	});

	/* 通信開始 */
	xhrText.send(null);
}


function XHReqT (xhr, cnvsCntxt, textArea) {
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
	var url = "http://greenplace.iobb.net:7001/xhr-test-text.js";
	xhr.open("GET" , url, true);
}

class XHReqI {
	
}

function XHReqI (xhr, cnvsCntxt, textArea) {
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
	var url = "http://localhost:1024/xhr-test-text.js";
	xhr.open("GET" , url, true);
}

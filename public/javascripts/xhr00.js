/*eslint-env browser */


/*
 * 読み込み完了したらinitial()呼ぶ
 */
window.addEventListener("load", initial);


/*******************************************************************************
 * XHReqText クラス
 * ・XML Http Request通信の状態をテキストエリアに表示する。
 * ・サーバとXML Http Request 通信して得たテキストをキャンバスに描画する。
 *******************************************************************************/

var XHReqText = function (cnvsCntxt, textArea) {
/* cnvsCntxt : 画像を表示するコンテクスト
 * textArea : 通信中状態を表示するテキストエリア
 */
	this.xhr = new XMLHttpRequest();
	this.CanvasContext = cnvsCntxt;
	this.TextArea = textArea;
	
	/*  通信状態が変化する度に表示する。
	 *  通信完了時は受信した文字列をcanvasに表示する(失敗は考慮してない)
	 */
	var wxhr = this.xhr; /* onreadystatechange中のthisが思ったこのオブジェクトにならないための措置 */
	wxhr.onreadystatechange = function () {
		switch(wxhr.readyState){ /* wxhr→thisならうまくいく。this.xhrはダメ */
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
				/* canvasに受信したテキストを描画する */
				cnvsCntxt.font = "bold 24pt 'arial'";
				cnvsCntxt.strokeStyle = "red";
				cnvsCntxt.strokeText(wxhr.responseText, 20, 300);
				break;
		}
	};
};

XHReqText.prototype.send = function () {
/* send を使うためだけのラッパーみたいな */

	/* HTTPメソッド、アクセス先等、通信の設定を行う */
	var url = "http://localhost:1024/xhr-test-text.js";
	this.xhr.open("GET" , url, true);

	this.xhr.send(null);	
};


/*******************************************************************************
 * XHReqImage クラス
 * ・XML Http Request通信の状態をテキストエリアに表示する。
 * ・サーバとXML Http Request 通信して得た画像をキャンバスに描画する。
 *******************************************************************************/

var XHReqImage = function (cnvsCntxt, textArea) {
/* cnvsCntxt : 画像を表示するコンテクスト
 * textArea : 通信中状態を表示するテキストエリア
 */
	this.xhr = new XMLHttpRequest();
	this.CanvasContext = cnvsCntxt;
	this.TextArea = textArea;
	this.X = 0;
	this.Y = 0;	
};

XHReqImage.prototype.Fonreadystatechange = function (xthis) {
/* onreadystatechange中で参照する変数の値を、イベント発生時の値とするにはどうしたらいいのか。
 * 外部で定義した変数(極端な話グローバルとか)を参照するのはいかがなものか。
 * かと言って、onreadystatechange中ではthisそのままは使えない(イベント発生時に属しているものになる)。
 * とりあえず高階関数/クロージャで(thisを引数として受け取って)毎回定義することにした。
 */
	return (
		function () {
			switch(xthis.xhr.readyState){
				case 1:
					xthis.TextArea.value = xthis.TextArea.value + "open() メソッドの呼び出しが完了した\n\n";
					break;
				case 2:
					xthis.TextArea.value = xthis.TextArea.value + "レスポンスヘッダの受信が完了した\n\n";
					break;
				case 3:
					xthis.TextArea.value = xthis.TextArea.value + "レスポンスボディを受信中（繰り返し実行される）\n\n";
					break;
				case 4:
					xthis.TextArea.value = xthis.TextArea.value + "XHR 通信が完了した（成功失敗に関わらず）\n\n";
					/* 受信したURLの画像を読み込みcanvasに描画する */
					var img = new Image();
					img.src = "http://localhost:1024" + xthis.xhr.responseText;
					img.onload = function() {
						/* メソッド中は全てxthisを統一して使用しているが、
						 * ぶっちゃけxthisが必要なのは、xthis.X、xthis.Yの2つだけ。それ以外は普通のthisでいいはず。
						 */
						xthis.CanvasContext.drawImage(img, xthis.X, xthis.Y);
					};
					break;
			}
		}
	);
};

XHReqImage.prototype.send = function (X, Y) {
/* send を使うためだけのラッパーみたいな…のつもりが、そうでもなかったw */
	this.X = X;
	this.Y = Y;

	/* thisを引数として、onreadystatechangeで実行する関数を毎回定義する */
	this.xhr.onreadystatechange = this.Fonreadystatechange(this);

	/* HTTPメソッド、アクセス先等、通信の設定を行う */
	var url = "http://localhost:1024/xhr-test-image.js";
	this.xhr.open("GET" , url, true);

	this.xhr.send(null);
};


/*******************************************************************************
 * initial 関数
 * ・読み込みが完了したら、最初に呼ばれる関数。¨ãªã¢ãã­ã£ã³ãã¹ã»
 * ・XML Http Request通信を開始する。
 *******************************************************************************/

/*
 * XMLHttpRequest使ってサーバから文字列を受信し、canvasに描画する
 */
function initial() {
	/* 各エレメントを設定 */
	var Canvas = document.querySelector("#canvas");
	var cnvsCntxt = Canvas.getContext("2d");
	var textArea = document.querySelector("#xhrState");

	/* XMLHttpRequestオブジェクトを定義 */
	var xhrText = new XHReqText(cnvsCntxt, textArea);
	var xhrImage = new XHReqImage(cnvsCntxt, textArea);

	cnvsCntxt.font = "bold 20pt 'arial'";
	cnvsCntxt.strokeStyle = "black";
	cnvsCntxt.strokeText("これからXMLHTTPRequestを使って通信します。", 20, 200);
	cnvsCntxt.strokeText("赤字で受信したデータを表示します。", 20, 240);

	/* canvas上をクリックされた時に、画像のURLを受信して画像を読み込みcanvasのクリックされた場所に描画する */
	Canvas.addEventListener("click", function (e) {
		// ブラウザ上のcanvasの座標を参照する。
		var rect = Canvas.getBoundingClientRect() ;
		var pX = rect.left ;
		var pY = rect.top ;

		// クリックされた時点のブラウザ上のマウスの位置と、上で参照したcanvasの座標から、
		// canvas上のマウスの座標を算出する。
		var oX = e.clientX - pX;
		var oY = e.clientY - pY;
		
		xhrImage.send(oX, oY);
	});

	/* テキストを受信してcanvasに描画する */
	xhrText.send();
}

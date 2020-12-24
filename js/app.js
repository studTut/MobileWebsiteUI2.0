var camera, scene, renderer;
var controls;
var object;

var alpha=0, beta=0, gamma=0;
var alphas=0, betas=0, gammas=0;
var line = 200;
var space = line * 1.1;
var move;
var no = 1;				// 数値格納用
var number;			// 数値表示部分のDOM取得用
var posY = -4000;
var initbeta,initalpha,initgamma;
//var arg = 60;
var arg;
var tm = 0;
var t = 0;
var countup = function() {tm ++;}
var a = -10;//減速２０



window.addEventListener("deviceorientation", (dat) => {
    alpha = dat.alpha;  // z軸（反時計回り）
    beta  = dat.beta;   // x軸（引き起こす）
    gamma = dat.gamma;  // y軸（右に傾ける）
});

window.addEventListener("deviceorientation", (dat) => {
     initalpha = dat.alpha;  // z軸（反時計回り）
     initbeta  = dat.beta;   // x軸（引き起こす）
     initgamma = dat.gamma;  // y軸（右に傾ける）
	arg = initbeta + 15;
}, {once : true} );

window.addEventListener("devicemotion", function (e){
    alphas = Math.round(10*e.rotationRate.alpha)/10;  // z軸（反時計回り）
    betas  = Math.round(10*e.rotationRate.beta)/10;   // x軸（引き起こす）
    gammas = Math.round(10*e.rotationRate.gamma)/10;  // y軸（右に傾ける）
});

init();
animate();

function init() {
    //initbeta = beta;

	
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        1, 
        5000
    );
    
    camera.position.z = 1000;


    menu = new THREE.CSS3DObject(document.getElementById('menu'));
    scene.add(menu);
    menu.position.x = 0;
    menu.position.y = 1.5*space;
    menu.position.z = 2*space;
    
    object6 = new THREE.CSS3DObject(document.getElementById('text'));
    scene.add(object6);
    object6.position.x = 0;
    object6.position.y = 0;
    object6.position.z = 0;
	


    // CSS3Dレンダラー
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight); 
    renderer.domElement.style.position = 'absolute'; // スタイル設定
    document.getElementById('container').appendChild(renderer.domElement); //#containerにappend
	
    // カメラコントローラー
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5; // 感度設定
    controls.addEventListener('change', render); // 値が変わった（マウスで何か位置が変更された）ときに render() を呼び出す

    window.addEventListener('resize', onWindowResize, false);
	
	window.addEventListener("load", function(){
	// 数値表示部分のDOM取得
	//number = document.getElementById("number");
	
	// 数値を画面に表示
	//no = 0;
	//tm = 0;
	//setNumber();

	// スワイプイベント設定
	setSwipe("#text");
});
}

function onWindowResize() {
    // カメラ設定
    camera.aspect = window.innerWidth / window.innerHeight; // カメラの縦横比を再設定
    camera.updateProjectionMatrix(); // 更新
    renderer.setSize(window.innerWidth, window.innerHeight); // レンダリングサイズを再設定
}



function animate() {
    requestAnimationFrame(animate);
    
	/*
    if(beta <= arg) {
    menu.rotation.x = arg/10 -1*beta/10;
    menu.position.y = 2100 -2000*beta/arg;
    } else {
	    menu.rotation.x = 0;
	    menu.position.y = 100;
    }*/
	
if(betas <-10 || betas > 100) {
	menu.rotation.x -= betas;
	menu.position.y -= betas/10;
	/* if(menu.rotation.x >=15) {
		menu.rotation.x = 15;
	}else if(menu.rotation.x <= 0){
		menu.rotation.x = 0;
	}
	if(menu.position.y >= 5) {
		menu.position.y = 5;
	}else if(menu.position.y <= 0) {
		menu.position.y = 0;
	} */
} else if ( betas<= -10 && betas <= 100) {
	menu.rotation.x -= 0;
	menu.position.y -= 0;
}
	

 if(posY >= -4000 && posY <= 4200) {
	 object6.position.y = posY;
    } else if (posY < -4000 ){
	    object6.position.y = -4000;
    } else if (posY > 4200) {
	    object6.position.y = 4200;
    }
   
    document.querySelector('#menu').style.backgroundColor = 'hsl(220,50%,50%)'

    renderer.render(scene, camera);
}


function render() {
    renderer.render(scene, camera);
}

function setSwipe(elem) {
	let t = document.querySelector(elem);
	let startY;		// タッチ開始 y座標
	let moveY;	// スワイプ中の y座標
	let dist = 30;	// スワイプを感知する最低距離（ピクセル単位）

	
	// タッチ開始時： y座標を取得
	t.addEventListener("touchstart", function(e) {
		e.preventDefault();
		startY = e.touches[0].pageY;
		var id = setInterval(countup,10); タイマースタートと同時にタイマーを取得
		//setNumber();
	});
		
	// スワイプ中： y座標を取得
	t.addEventListener("touchmove", function(e) {
		//setNumber();
		e.preventDefault();
		moveY = e.changedTouches[0].pageY;
		if (startY > moveY && startY > moveY + dist) {		// 下へ移動（上へスクロール）
			if (posY <= 4200) {
				posY +=0.1*(startY - moveY);
			} else {posY += 0;}
			//previous();
		}
		else if (startY < moveY && startY + dist < moveY) {	// 上へ移動（下へスクロール）
			
			if (posY >= -4000) {
				posY -= 0.1*(moveY - startY);
			} else {posY -= 0;}
			//next();
		}
	});
	
	// タッチ終了時： スワイプした距離から左右どちらにスワイプしたかを判定する/距離が短い場合何もしない
	
	t.addEventListener("touchend", function(e) {
        clearInterval(id);
		if (startY > moveY && startY > moveY + dist) {		// 下へスクロール
			var initV = (startY - moveY)/tm;//初速度
			//惰力の制御
			var coast1 = setInterval(function() {
                t++;
				var VT = initV + a*t
				if (VT > 0){ posY += VT;
                } else if (VT <= 0) {
                    cleanInterval(coast1); t = 0;
                }}, 10);　
				
				
		}　else if (startY < moveY && startY + dist < moveY) {	// 左から右にスワイプ
            		var initV2 = (moveY - startY)/tm;//初速度
			//惰力の制御
			var coast1 = setInterval(function() {
                t++;
				var VT2 = initV2 + a*t
				if (VT2 > 0){ posY -= VT2;
                } else if (VT2 <= 0) {
                    cleanInterval(coast1); t = 0;
                }}, 10);
		}
	});
		tm = 0;//はじめのタイマーをリセット
		//setNumber();
	
}

/*
function next(){
	no = Math.round(posY);
	setNumber();
}

 //前の番号を表示
function previous(){
	no = Math.round(posY);
	setNumber();
}

//数値を画面に表示する
*/
//function setNumber(){
	//number.innerHTML = tm;
//}




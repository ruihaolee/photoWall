var rangeXY = {};
var centerID = null;
window.onload = function(){
	(function(){
		setRangeXY();
		var startCenter = random([0,10]);
		centerID = startCenter;
		circleStart(startCenter);
		photosGetself(startCenter);
		//alert(startCenter);
		var circlesBox = document.getElementById("clickLine");
		circlesBox.addEventListener('click',hanldClickCircle,false);
	})();
};
function setRangeXY(){
	var example = $('.photo');
	var wall = $('.wall');
	rangeXY.leftMinX = -0.8 * parseInt(example.css('width').match(/\d+/)[0]);
	rangeXY.leftMaxX = 0.5 * parseInt(wall.css('width').match(/\d+/)[0]) - 1.5 * parseInt(example.css('width').match(/\d+/)[0]) - 40;
	rangeXY.rightMinX = 0.5 * (parseInt(wall.css('width').match(/\d+/)[0]) + parseInt(example.css('width').match(/\d+/)[0])) + 40;
	rangeXY.rightMaxX = parseInt(wall.css('width').match(/\d+/)[0]) - 0.5 * parseInt(example.css('width').match(/\d+/)[0]);
	rangeXY.minY = -0.5 * parseInt(example.css('height').match(/\d+/)[0]);
	rangeXY.maxY = parseInt(wall.css('height').match(/\d+/)[0]) - 0.5 * parseInt(example.css('height').match(/\d+/)[0]);
	for(var i = 0;i < dataArr.length;i++){
		moveAnimate.moveXY[i] = [];
		moveAnimate.ifAnimate[i] = [];
	}
			
	console.log(moveAnimate.moveXY);
}
function circleStart(circleNum){
	var circleButton = document.getElementById('click_' + circleNum);
	circleButton.className = 'isBig';
	$(circleButton).css({
		width: "7%" ,
		height: "73%",
		marginTop:'5px'
	});
}
function photosGetself(centerNum){
	var example = $('.photo');
	var wall = $('.wall');
	for(var i = 0;i < dataArr.length;i++){
		var newPhoto = example.clone();
		newPhoto.attr('id',"photo_" + i);
		newPhoto.find('img').attr('src',dataArr[i].img);
		newPhoto.find('.side-front').find('p:last-child').text(dataArr[i].title);
		newPhoto.find('.side-back').find('p:first-child').text(dataArr[i].textMov);
		if(i == (centerNum - 1)){
			var centerX = Math.ceil(parseInt(wall.css('width')) * 0.4);
			var centerY = Math.ceil(parseInt(wall.css('height')) * 0.15);
			newPhoto.css({
				left: centerX + 'px',
				top: centerY + 'px',
				transform: 'rotate(0deg)'
			});
			var domEle = newPhoto[0];
			//domEle.firstElementChild.className  = domEle.firstElementChild.className + ' wrap-front';
			domEle.addEventListener('click',clickRotate3d,false);
			for(var j = 0;j < domEle.firstElementChild.children.length;j++){
				domEle.firstElementChild.children[j].style.backgroundColor = '#FFFFFF';//修改side背景颜色
			}
			var newClassName = domEle.className + ' center wrap-front';//
			domEle.className = newClassName;//修改photo class
			wall.append(domEle);
		}
		else{
			var leftOrRight = random([-1,1]);
			if(random([-1,1]) == 0)
				var rotateDeg = Math.ceil(60 * Math.random());
			else
				var rotateDeg = Math.ceil(-60 * Math.random());
			newPhoto.css({
				transform:'rotate(' + rotateDeg + 'deg)'
			});
			if(leftOrRight == 0){//left
				var x = random([rangeXY.leftMinX,rangeXY.leftMaxX]);
				var y = random([rangeXY.minY,rangeXY.maxY]);
				newPhoto.css({
					left : x + 'px',
					top : y + 'px'
				});
			}
			else{//right
				var x = random([rangeXY.rightMaxX,rangeXY.rightMinX]);
				var y = random([rangeXY.minY,rangeXY.maxY]);
				newPhoto.css({
					left : x + 'px',
					top :y + 'px'
				});
			}
			wall.append(newPhoto);
		}
	}
	//example.remove();   //用jQuery移除
	example[0].parentNode.removeChild(example[0]); //用原生JS移除
}
function random(range){
	var min = Math.min(range[0],range[1]);
	var max = Math.max(range[0],range[1]);
	var getRandom = Math.ceil(Math.random() * (max - min) + min);
	return getRandom;
}
function clickRotate3d(event){
	var newClassName;
	var centerPhoto = document.getElementsByClassName('center')[0];
	//var do3dRotateEle = centerPhoto.firstElementChild;
		//方法二: $(centerPhoto).toggleClass('wrap-back');
	if(centerPhoto.className.search(/wrap-back/) != -1){
		newClassName = centerPhoto.className.replace(/wrap-back/,"wrap-front");
		centerPhoto.setAttribute('class',newClassName); 
	}
	else{
		newClassName = centerPhoto.className.replace(/wrap-front/,"wrap-back");
		centerPhoto.setAttribute('class',newClassName);
	}
}
function hanldClickCircle(){
	jQuery.fx.speeds['lee'] = 300;
	var thisEvent = arguments[0] || window.event;
	var thisTarget = thisEvent.target || thisEvent.srcElement;
	if(thisTarget.id === 'clickLine')
		return;
	var nowPhotoId = thisTarget.id.match(/\d{1,}/)[0];
	console.log(nowPhotoId);
	console.log(centerID);
	if(parseInt(nowPhotoId) === centerID){
		clickRotate3d();
		return;
	}
	centerID = parseInt(nowPhotoId);
	moveAnimate.newAnimate(nowPhotoId);
	var perBigCircle = document.getElementsByClassName('isBig')[0];
	$(perBigCircle).animate({
		width:"4%",
		height:"43%",
		marginTop: 10
	},{
		duration:'lee',
		easing: "swing"
	}).removeClass('isBig');
	var nowBigCircle = document.getElementById('click_' + nowPhotoId);
	$(nowBigCircle).animate({
		width:"7%",
		height:"73%",
		marginTop: 5
	},{
		duration:'lee',
		easing: "swing"
	}).addClass('isBig');
}
var moveAnimate = {
	ifAnimate:[],
	nowCenterId:null,
	moveXY:[],
	newAnimate:function(nowCenterId){
		//解除上一个在中间的海报！
		this.nowCenterId = nowCenterId;
		$('.center')[0].removeEventListener('click',clickRotate3d,false);
		$('.center').attr('class','photo').find('.side').css({
			background: '#F2F2F2'
		});
		var nowCenterPhoto = $('#photo_' + (this.nowCenterId - 1));
		nowCenterPhoto[0].addEventListener('click',clickRotate3d,false);
		nowCenterPhoto.attr('class','photo center wrap-front').find('.side').css({
			background: '#FFFFFF'
		});
		moveAnimate.moveEveryPhoto();
	},
	moveEveryPhoto:function(){
		var wall = $('.wall');
		var centerX = Math.ceil(parseInt(wall.css('width')) * 0.4);
		var centerY = Math.ceil(parseInt(wall.css('height')) * 0.15);
		this.moveXY[this.nowCenterId - 1] = [centerX,centerY,0];//[x,y,deg]
		for(var i = 0;i < dataArr.length;i++){
			if((this.nowCenterId - 1) == i)
				continue;
			var leftOrRight = random([-1,1]);
			if(leftOrRight == 0){//左
				this.moveXY[i][0] =  random([rangeXY.leftMinX,rangeXY.leftMaxX]); 
			}
			else{//右
				this.moveXY[i][0] = random([rangeXY.rightMaxX,rangeXY.rightMinX]);
			}
			this.moveXY[i][1] = random([rangeXY.minY,rangeXY.maxY]);
			if(random([-1,1]) == 0)
				this.moveXY[i][2] =	Math.ceil(Math.random() * 60);
			else
				this.moveXY[i][2] = Math.ceil(Math.random() * -60);
		}
		for(var j = 0;j < this.moveXY.length; j++)
			this.ifAnimate[j] = ['yes','yes','yes'];//[x,y,deg]
		// for(var j = 0; j < this.moveXY.length;j++){
		// 	console.log(this.moveXY[j]);
		// 	console.log(this.ifAnimate[j]);
		// }
		// window.requestAnimationFrame(this.startMove.bind(this));
		setTimeout(this.startMove.bind(this),0);
	},
	startMove:function(){
		jQuery.fx.speeds['lee'] = 500;
		var photosArr = document.getElementsByClassName('photo');
		var that = this;
		for(var i = 0;i < photosArr.length; i++){
 			$(photosArr[i]).animate({
 				left: this.moveXY[i][0],
 				top: this.moveXY[i][1]
 			},{
 				duration:'lee',
 				easing: "swing"
 			});
 			$(photosArr[i]).css({
 				transform: 'rotate(' + this.moveXY[i][2] + 'deg)'
 			})
		}
		// var photosArr = document.getElementsByClassName('photo');
		// for(var i = 0;i < photosArr.length;i++)
		// 	window.requestAnimationFrame(this.fuckMove.bind(this,i));
	}
	// fuckMove:function(num){
	// 		var photosArr = document.getElementsByClassName('photo');
	// 		var thisPerX = parseInt(photosArr[num].style.left);
	// 		var thisPerY = parseInt(photosArr[num].style.top);
	// 		var thisDeg = parseInt(photosArr[num].style.transform.match(/-*\d+/)[0]);
	// 		if(this.ifAnimate[num][0] === 'yes'){
	// 			if(thisPerX < this.moveXY[num][0])
	// 				thisPerX = thisPerX + 10;
	// 			else
	// 				thisPerX = thisPerX - 10;
	// 			photosArr[num].style.left = thisPerX + 'px';
	// 			if(thisPerX >= (this.moveXY[num][0] - 10) && thisPerX <= (this.moveXY[num][0] + 10))
	// 				this.ifAnimate[num][0] = 'no';
	// 		}
	// 		if(this.ifAnimate[num][1] === 'yes'){
	// 			if(thisPerY < this.moveXY[num][1])
	// 				thisPerY = thisPerY + 10;
	// 			else
	// 				thisPerY = thisPerY - 10;
	// 			photosArr[num].style.top = thisPerY + 'px';
	// 			if(thisPerY >= (this.moveXY[num][1] - 10) && thisPerY <= (this.moveXY[num][1] + 10))
	// 				this.ifAnimate[num][1] = 'no';
	// 		}
	// 		if(this.ifAnimate[num][2] === 'yes'){
	// 			if(thisDeg < this.moveXY[num][2])
	// 				thisDeg = thisDeg + 1;
	// 			else
	// 				thisDeg = thisDeg - 1;
	// 			photosArr[num].style.transform = 'rotate(' + thisDeg + 'deg)';
	// 			if(thisDeg === this.moveXY[num][2])
	// 				this.ifAnimate[num][2] = 'no';
	// 		}
	// 		if(this.ifAnimate[num][0] === 'yes' || this.ifAnimate[num][0] === 'yes' || this.ifAnimate[num][0] === 'yes')
	// 			window.requestAnimationFrame(this.fuckMove.bind(this,num));
	// }
};


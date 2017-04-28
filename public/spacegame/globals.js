
define(function () {
	"use strict"
	//Do setup work here

	var canvas_width = (window.innerWidth).clamp(480, 1200);
	//todo: clamp prototype should run first.
	var canvas_height = window.innerHeight-5;
	var canvasElement = $("<canvas width='" + canvas_width +
			"' height='" + canvas_height + "'></canvas>");
	var canvas = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('#gamePage');

	return {
		CANVAS_WIDTH : canvas_width,
		CANVAS_HEIGHT : canvas_height,
		FPS : 60,
		CANVAS : canvas,
		SOUND : Sound, //TODO: this should be imported
		SPRITE : Sprite,
    	BACKGROUNDLINES : [],
		PLAYERBULLETS : [],
    	ENEMIES: [],
    	KEYDOWN: keydown,
    	LOADING:3,
    	OUTGOINGEMAILDATA:[],
    	INCOMINGEMAILDATA:[],
    	RESTIME:0, //avg response time
    	GAMEHOUR:0,
    	HOURLENGTH:20, //how long (in seconds) is one hour in game time
    	HOURITR:0, //hour iteration number
    	HOURENEMYNUMBER:0,
    	GAMEMODE:'alldirection', //'leftrightonly', 'alldirection'
		// GAMESTOP KEY
		STOPKEY: null,
		//enemy defeated counts
		DEFEAT: 0
	}
});

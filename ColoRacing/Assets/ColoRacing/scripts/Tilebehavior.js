#pragma strict

var nbpass : float[] = new float[4];

var total : int = 0;

function WentThrough(idplayer : int, player : Transform, tile : GameObject)
{

	var tileC : Tilebehavior = tile.gameObject.GetComponent(Tilebehavior);
	tileC.total = 1000;
	
	tileC.nbpass[idplayer] += player.GetComponent(CharacterMove).colorRate;
	
	if(tileC.nbpass[idplayer] > 100)
		tileC.nbpass[idplayer] = 100;
		
	while(tileC.total > 100)
	{
		tileC.total = 0;
		for (var i = 0; i < tileC.nbpass.Length; i++)
		{
			if (i != idplayer && tileC.nbpass[i] > 0)
				tileC.nbpass[i] -= player.GetComponent(CharacterMove).uncolorRate;
			tileC.total += tileC.nbpass[i];
		}
	}

	tile.transform.renderer.material.color.r = 0;
	tile.transform.renderer.material.color.g = 0;
	tile.transform.renderer.material.color.b = 0;
	
	for (i = 0; i < tileC.nbpass.Length; i++)
	{
		tile.transform.renderer.material.color.r += player.transform.renderer.material.color.r * (tileC.nbpass[i] / 100);
		tile.transform.renderer.material.color.g += player.transform.renderer.material.color.g * (tileC.nbpass[i] / 100);
		tile.transform.renderer.material.color.b += player.transform.renderer.material.color.b * (tileC.nbpass[i] / 100);
	}
}

function ChangeSpeed(idplayer : int, player : Transform, tile : GameObject)
{
	var playerC : CharacterMove = player.gameObject.GetComponent(CharacterMove);
	var tileC : Tilebehavior = tile.gameObject.GetComponent(Tilebehavior);
	var playerScore : float = tileC.nbpass[idplayer];
	var speedToAdd : float;
	var normalSpeed : float = playerC.normalSpeed;
	var maxSpeed : float = 100;
	var minSpeed : float = 10;
	var strongestColor : float = 0;

	for (var i = 0; i < tileC.nbpass.Length; i++)
		if (strongestColor < tileC.nbpass[i])
			strongestColor = tileC.nbpass[i];
	if (tileC.nbpass[idplayer] >= strongestColor)
	{
		speedToAdd = normalSpeed + playerC.speed * (playerScore / 100);
		playerC.speed  = speedToAdd;
		if (playerC.speed > maxSpeed)
			playerC.speed = maxSpeed;
	}
	else if (tileC.nbpass[idplayer] < strongestColor)
	{
		speedToAdd = normalSpeed - playerC.speed * (playerScore / 100);
		playerC.speed  = speedToAdd;
		if (playerC.speed < minSpeed)
			playerC.speed = minSpeed;
	}
}
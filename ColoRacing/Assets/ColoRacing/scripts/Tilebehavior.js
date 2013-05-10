#pragma strict

var nbpass : float[] = new float[4];

var total : int;

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
			if (tileC.nbpass[i] < 0)
				tileC.nbpass[i] = 0;
			tileC.total += tileC.nbpass[i];
		}
	}

	tileC.transform.renderer.material.color.r = 0;
	tileC.transform.renderer.material.color.g = 0;
	tileC.transform.renderer.material.color.b = 0;
	var colorLayer : Color[] = new Color[4];
	var networkManager : NetworkBehavior = GameObject.Find("NetworkManager").GetComponent(NetworkBehavior);
	for (i = 0; i < tileC.nbpass.Length; i++)
	{
		colorLayer[i] = Color(networkManager.colorTab[i].r * (tileC.nbpass[i] / 100),
							networkManager.colorTab[i].g * (tileC.nbpass[i] / 100),
							networkManager.colorTab[i].b * (tileC.nbpass[i] / 100));
		//Debug.Log(i);
		/*tileC.transform.renderer.material.color.r += transform.renderer.material.color.r * (tileC.nbpass[i] / 100);
		tileC.transform.renderer.material.color.g += transform.renderer.material.color.g * (tileC.nbpass[i] / 100);
		tileC.transform.renderer.material.color.b += transform.renderer.material.color.b * (tileC.nbpass[i] / 100);*/
	}
	tileC.renderer.material.color = colorLayer[0] + colorLayer[1] + colorLayer[2] + colorLayer[3];
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
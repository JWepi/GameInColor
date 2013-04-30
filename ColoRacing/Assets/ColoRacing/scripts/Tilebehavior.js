#pragma strict

var nbpass : float[] = new float[4];

var total : int = 0;

function Start ()
{
}

function Update ()
{
}

function WentThrough(idplayer : int, player : Transform, tile : ControllerColliderHit)
{

	var tileC : Tilebehavior = tile.gameObject.GetComponent(Tilebehavior);
	tileC.total = 1000;
	
	tileC.nbpass[idplayer] += 5;
	
	if(tileC.nbpass[idplayer] > 100)
		tileC.nbpass[idplayer] = 100;
		
	while(tileC.total > 100)
	{
		tileC.total = 0;
		for (var i = 0; i < tileC.nbpass.Length; i++)
		{
			if (i != idplayer && tileC.nbpass[i] > 0)
				tileC.nbpass[i] -= 3;
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
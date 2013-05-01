var tileBehavior : Tilebehavior;

function ColorFive(idplayer : int, player : Transform, bonus : ControllerColliderHit)
{
	var timeNow = Time.realtimeSinceStartup;
	var x : int;
	var z : int;
	var xTile : int;
	var zTile : int;
	
	x = Mathf.Round(player.position.x / 10) * 10;
	z = Mathf.Round(player.position.z / 10) * 10;
	
	for (var i = 0; i < 3; i++)
	{
		xTile = x - 20;
		zTile = z - 20;
		while (xTile < x + 20)
		{
			while(zTile < z + 20)
			{
				var tile : GameObject = GameObject.Find("Tile"+xTile+","+zTile);
				tile.GetComponent(Tilebehavior).WentThrough(idplayer, player, tile);
				zTile += 10;
			}
			zTile = z - 20;
			xTile += 10;
		}
	}
}

function ImproveSight(player : Transform, IOrL : boolean)
{
	if (IOrL == true)
		player.FindChild("PlayerCamera").camera.farClipPlane = 200;
	else if (IOrL == false)
		player.FindChild("PlayerCamera").camera.farClipPlane = 70;
}

function ImproveColorRate(player : Transform, IOrL : boolean)
{
	if (IOrL == true)
		player.GetComponent(CharacterMove).colorRate = 10;
	else if (IOrL == false)
		player.GetComponent(CharacterMove).colorRate = 2;
}

function ImproveSpeed(player : Transform, IOrL : boolean)
{
	if (IOrL == true)
	{
		player.GetComponent(CharacterMove).speed = 75;
		player.GetComponent(CharacterMove).normalSpeed = 75;
	}
	else if (IOrL == false)
	{
		player.GetComponent(CharacterMove).speed = 30;
		player.GetComponent(CharacterMove).normalSpeed = 30;
	}
}

function StopColor(player : Transform)
{
	player.GetComponent(CharacterMove).coloring = false;
}

function RunBonus(idplayer : int, player : Transform, bonus : ControllerColliderHit, message : GameObject)
{
	var bOrM : int = Random.Range(0, 2);
	
	if (bOrM == 0) //Bonus
	{
		var bonusNumber : int = Random.Range(0, 11);
		
		if (bonusNumber >= 0 || bonusNumber <= 4)
		{
			ColorFive(idplayer, player, bonus);
			message.guiText.text = "Color Splash";
		}
		else if (bonusNumber >= 5 || bonusNumber <= 7)
		{
			ImproveSight(player, true);
			message.guiText.text = "Improve Sight";
		}
		else if (bonusNumber == 8)
		{
			ImproveColorRate(player, true);
			message.guiText.text = "Improve Color Rate";
		}
		else if (bonusNumber >= 9 || bonusNumber <= 10)
		{
			ImproveSpeed(player, true);
			message.guiText.text = "Improve Speed";
		}
	}
	else if (bOrM == 1) //Malus
	{
		var malusNumber : int = Random.Range(0, 11);
		
		if (malusNumber >= 0 && malusNumber <= 2)
		{
			ImproveSight(player, false);
			message.guiText.text = "Lower Sight";
		}
		else if (malusNumber >= 3 && malusNumber <= 5)
		{
			ImproveColorRate(player, false);
			message.guiText.text = "Lower ColorRate";
		}
		else if (malusNumber >= 6 && malusNumber <= 9)
		{
			ImproveSpeed(player, false);
			message.guiText.text = "Lower Speed";
		}
		else if (malusNumber == 10)
		{
			StopColor(player);
			message.guiText.text = "No Color";
		}
	}
}
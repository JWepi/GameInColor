#pragma strict
var speed : float = 3.0;

var rotateSpeed : float = 3.0;

var lastInterval : double;

var id : int;

var nbRound : int = 1;

var tileBehavior : Tilebehavior;

function Start ()
{
	lastInterval = Time.realtimeSinceStartup;
}

function Update ()
{
	var controller : CharacterController = GetComponent(CharacterController);
	transform.Rotate(0, Input.GetAxis("Horizontal") * rotateSpeed, 0);
	var forward : Vector3 = transform.TransformDirection(Vector3.forward);
	var curSpeed : float = speed * Input.GetAxis ("Vertical");
	controller.SimpleMove(forward * curSpeed);
}

function TeleportPlayer(hit : ControllerColliderHit)
{
	var mapX : float = GameObject.Find("Wall1").transform.localScale.x;
	var nbChild : float = 0;
	var parent : Transform = hit.transform.parent.gameObject.transform;
	var i : int = 0;
	for (var child : Transform in parent)
	{
		nbChild++;
		i++;
	}	
	var childTab : Transform[] = new Transform[nbChild];
	i = 0;
	
	for (var child : Transform in parent)
	{
		childTab[i] = child;
		i++;
	}
	var randBH : int = Random.Range(0, nbChild - 1);
	while (childTab[randBH].transform.position.Equals(transform.position))
	{
		randBH = Random.Range(0, nbChild - 1);
		//Debug.Log("SAME");
	}

	for (i = 0; i < nbChild; i++)
	{
		if (i == randBH)
		{
			transform.position.x = childTab[i].position.x;
			transform.position.z = childTab[i].position.z;
			transform.position.y = 5;
		}
	}
}

function StartNextRound(message : GameObject)
{
	nbRound += 1;
	/*var wallBoard : GameObject = GameObject.Find("WallBoard");
	var bonusBoard : GameObject = GameObject.Find("BonusBoard");
	var playerBoard : GameObject = GameObject.Find("PlayerBoard");
	var blackholeBoard : GameObject = GameObject.Find("BlackHoleBoard");*/
	Destroy(GameObject.Find("WallBoard"));
	Destroy(GameObject.Find("BonusBoard"));
	Destroy(GameObject.Find("PlayerBoard"));
	Destroy(GameObject.Find("BlackHoleBoard"));
	var mapBehavior : CreateMap = GameObject.Find("Terrain").GetComponent(CreateMap);
	mapBehavior.GenerateBlackHole();
	mapBehavior.GenerateBonus();
	mapBehavior.GenerateWall();
	mapBehavior.GenerateFinish();
	mapBehavior.GeneratePlayerSpawn();
	
	//var message : GameObject = GameObject.Find("FinishMessage");
	message.guiText.text = "";
	//message.gameObject.SetActive(false);
}

function FinishRace()
{
	var i : int = 0;
	var cd : int;
	var message : GameObject = GameObject.Find("FinishMessage");

	message.guiText.text = transform.name + " HAS WIN";
	//message.gameObject.SetActive(true);
	yield WaitForSeconds(2);
	while (i < 3)
	{
		cd = 3 - i;
		message.guiText.text = cd.ToString();
		i++;
		yield WaitForSeconds(1);
	}
	//message.gameObject.SetActive(false);
	/*if (nbRound == 3)
	{
		//Final score
	}*/
	StartNextRound(message);
}

function OnControllerColliderHit(hit : ControllerColliderHit)
{
	var timeNow = Time.realtimeSinceStartup;
	
	if (hit.transform.tag == "MapGride" && (timeNow > lastInterval) && (timeNow - lastInterval > 0.1))
	{
		tileBehavior.UpgradeSpeed(id, transform, hit);
		tileBehavior.WentThrough(id, transform, hit);
		lastInterval = timeNow;
	}
	else if (hit.transform.tag == "Bonus")
	{
		Destroy(hit.gameObject);
		// Call bonus function
	}
	else if (hit.transform.tag == "BlackHole" && (timeNow > lastInterval) && (timeNow - lastInterval > 0.05))
	{
		// Call teleporte function
		TeleportPlayer(hit);
		lastInterval = timeNow;
	}
	else if (hit.transform.tag == "Finish" && (timeNow > lastInterval) && (timeNow - lastInterval > 0.05))
	{
		Destroy(hit.gameObject);
		lastInterval = timeNow;
		// End race
		FinishRace();
	}
}

@script RequireComponent(CharacterController)
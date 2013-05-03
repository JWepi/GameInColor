#pragma strict
var speed : float = 3.0;
var normalSpeed : float = 50;
var rotateSpeed : float = 3.0;

var lastInterval : double;

var id : int;

var nbRound : int = 1;

var tileBehavior : Tilebehavior;
var bonusBehavior : BonusBehavior;

var startX : float;
var startZ : float;

var colorRate : float = 5;
var uncolorRate : float = 3;
var coloring : boolean = true;

function Start ()
{
	lastInterval = Time.realtimeSinceStartup;
	startX = transform.position.x;
	startZ = transform.position.z;
	transform.FindChild("PlayerCamera").camera.farClipPlane = 120;
	colorRate = 5;
	uncolorRate = 3;
	normalSpeed = 50;
	speed = 50;
	coloring = true;
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
	var mapC : CreateMap = GameObject.Find("Terrain").gameObject.GetComponent(CreateMap);
	mapC.nbRound += 1;
	if (mapC.nbRound == 3)
		Application.LoadLevel(0);
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
	
	message.guiText.text = "";
}

function FinishRace()
{
	var i : int = 0;
	var cd : int;
	var message : GameObject = GameObject.Find("FinishMessage");

	message.guiText.text = transform.name + " HAS WIN";
	yield WaitForSeconds(2);
	while (i < 3)
	{
		cd = 3 - i;
		message.guiText.text = cd.ToString();
		i++;
		yield WaitForSeconds(1);
	}
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
		tileBehavior.ChangeSpeed(id, transform, hit.gameObject);
		if (coloring == true)
			tileBehavior.WentThrough(id, transform, hit.gameObject);
		lastInterval = timeNow;
	}
	else if (hit.transform.tag == "Bonus")
	{
		var message : GameObject = GameObject.Find("BonusMessage");
		Destroy(hit.gameObject);
		// Call bonus function
		bonusBehavior.RunBonus(id, transform, hit, message);
		yield WaitForSeconds(0.5);
		message.guiText.text = "";
	}
	else if (hit.transform.tag == "BlackHole" && (timeNow > lastInterval) && (timeNow - lastInterval > 0.05))
	{
		// Call teleporte function
		TeleportPlayer(hit);
		lastInterval = timeNow;
		yield WaitForSeconds(0.5);
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
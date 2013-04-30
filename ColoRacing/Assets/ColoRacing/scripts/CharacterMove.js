#pragma strict
var speed : float = 3.0;

var rotateSpeed : float = 3.0;

var lastInterval : double;

var id : int;

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
	var randBH : int = Random.Range(1, nbChild);
	Debug.Log(randBH);

	for (i = 0; i < nbChild; i++)
	{
		if (i == randBH)
		{
			transform.position.x = childTab[i].position.x;
			transform.position.z = childTab[i].position.z;
		}
	}
}

function OnControllerColliderHit(hit : ControllerColliderHit)
{
	var timeNow = Time.realtimeSinceStartup;
	
	if (hit.transform.tag == "MapGride" && (timeNow > lastInterval) && (timeNow - lastInterval > 0.1))
	{
		//hit.transform.renderer.material.color.r += (transform.renderer.material.color.r + 5) * Time.deltaTime;
		//hit.transform.renderer.material.color.g += 0;
		//hit.transform.renderer.material.color.b += 0;

		

		// Call TileBehavior WentThrough function
		tileBehavior.WentThrough(id, transform, hit);
		lastInterval = timeNow;
	}
	else if (hit.transform.tag == "Bonus")
	{
		Destroy(hit.gameObject);
		// Call bonus function
	}
	else if (hit.transform.tag == "BlackHole")
	{
		// Call teleporte function
		TeleportPlayer(hit);
	}
	else if (hit.transform.tag == "Finish")
	{
		Debug.Log("FINISH");
		// End race
	}
}

@script RequireComponent(CharacterController)
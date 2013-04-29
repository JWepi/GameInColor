#pragma strict
var speed : float = 3.0;

var rotateSpeed : float = 3.0;

var lastInterval : double;

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

function OnControllerColliderHit(hit : ControllerColliderHit)
{
	var timeNow = Time.realtimeSinceStartup;
	
	if (hit.transform.tag == "MapGride" && (timeNow > lastInterval) && (timeNow - lastInterval > 0.1))
	{
		hit.transform.renderer.material.color.r += (transform.renderer.material.color.r + 5) * Time.deltaTime;
		hit.transform.renderer.material.color.g += 0;
		hit.transform.renderer.material.color.b += 0;
		lastInterval = timeNow;
	}
	else if (hit.transform.tag == "Bonus")
	{
		Destroy(hit.gameObject);
		// Call bonus function
	}
	else if (hit.transform.tag == "BlackHole")
	{
		Debug.Log("SLURP");
		// Call teleporte function
	}
	else if (hit.transform.tag == "Finish")
	{
		Debug.Log("FINISH");
		// End race
	}
}

@script RequireComponent(CharacterController)
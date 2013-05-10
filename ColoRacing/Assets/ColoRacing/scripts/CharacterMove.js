var speed : float = 3.0;
var normalSpeed : float = 50;
var rotateSpeed : float = 3.0;

var lastInterval : double;

var id : int;

var tileBehavior : Tilebehavior;
var bonusBehavior : BonusBehavior;

var startX : float;
var startZ : float;

var colorRate : float = 5;
var uncolorRate : float = 2;
var coloring : boolean = true;

@script RequireComponent(NetworkView)

function Start()
{
	//if (gameObject.GetComponent(AudioListener).enabled == null)
	//networkView.RPC("setOwner", RPCMode.Server, Network.player);
	var message : Transform = transform.FindChild("BonusMessage");
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

/*function OnConnectedToServer()
{
Debug.Log("TEST");
	/*var networkC : NetworkBehavior = GameObject.Find("NetworkManager").GetComponent(NetworkBehavior);
	networkC.SpawnPlayer();
	if(!networkView.isMine) 
		Destroy(GameObject.FindChild("PlayerCamera"));
	lastInterval = Time.realtimeSinceStartup;
	startX = transform.position.x;
	startZ = transform.position.z;
	transform.FindChild("PlayerCamera").camera.farClipPlane = 120;
	colorRate = 5;
	uncolorRate = 3;
	normalSpeed = 50;
	speed = 50;
	coloring = true;
}*/
/*
    @RPC
    function setOwner(player : NetworkPlayer) : void {
        Debug.Log("Setting the owner.");
        owner = player;
        if(player == Network.player){
            //So it just so happens that WE are the player in question,
            //which means we can enable this control again
            enabled=true;
        }
        else {
            //Disable a bunch of other things here that are not interesting:
            if (GetComponent(Camera)) {
                GetComponent(Camera).enabled = false;
            }
            
            if (GetComponent(AudioListener)) {
                GetComponent(AudioListener).enabled = false;
            }
            
            if (GetComponent(GUILayer)) {
                GetComponent(GUILayer).enabled = false;
            }
        }
    }
    
    @RPC
    function getOwner() : NetworkPlayer {
        return owner;
    }
*/
function Update ()
{
	if (networkView.isMine)
	{
		var controller : CharacterController = GetComponent(CharacterController);
		transform.Rotate(0, Input.GetAxis("Horizontal") * rotateSpeed, 0);
		var forward : Vector3 = transform.TransformDirection(Vector3.forward);
		var curSpeed : float = speed * Input.GetAxis ("Vertical");
		controller.SimpleMove(forward * curSpeed);
	}
	else
	{
		enabled = false;
	}
}

function TeleportPlayer(hit : ControllerColliderHit)
{
	var i : int = 0;
	var blackHoleArray : GameObject[] = GameObject.FindGameObjectsWithTag("BlackHole");

	var randBH : int = Random.Range(0, blackHoleArray.length);

	while (randBH == id)
		randBH = Random.Range(0, blackHoleArray.length);

	for (i = 0; i < blackHoleArray.length - 1; i++)
	{
		if (i == randBH)
		{
			transform.position.x = blackHoleArray[i].transform.position.x;
			transform.position.z = blackHoleArray[i].transform.position.z;
			transform.position.y = 5;
		}
	}
}

function OnControllerColliderHit(hit : ControllerColliderHit)
{
	var timeNow = Time.realtimeSinceStartup;
	
	if (hit.transform.tag == "MapGride" && (timeNow > lastInterval) && (timeNow - lastInterval > 0.1))
	{
		tileBehavior.ChangeSpeed(id - 1, transform, hit.gameObject);
		if (coloring == true)
			tileBehavior.WentThrough(id - 1, transform, hit.gameObject);
		lastInterval = timeNow;
	}
	else if (hit.transform.tag == "Bonus")
	{
		var message : GameObject = GameObject.Find("BonusMessage");
		Network.Destroy(hit.gameObject);
		// Call bonus function
		bonusBehavior.RunBonus(id - 1, transform, hit, message);
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
		var networkManager : NetworkBehavior = GameObject.Find("NetworkManager").GetComponent(NetworkBehavior);
		Network.Destroy(hit.gameObject);
		lastInterval = timeNow;
		// End race
		networkManager.FinishRace(gameObject);
	}
}
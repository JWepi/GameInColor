var IPServer = "127.0.0.1";
//var  IPServ = "";
var board_size_ = "Map size";
var MaxPlayer = "Max player";
var currentPlayer : int = 0;

var boardPref : Transform;
var wallPref:Transform;
var bonusPref:Transform;
var blackHolePref:Transform;
var finishPref:Transform;
var playerPref:Transform;
var tile_prefab_ : Transform;

/*var board : GameObject;
var wBoard : GameObject;
var bhBoard : GameObject;
var bBoard : GameObject;
var finish : Transform;*/

var board_size_x_ : int;
var nbRound : int = 1;
var maxPlayer : int = 0;
var refreshing : boolean = false;
var hostData : HostData[];
var gameName : String = "ColoRacing";

public var colorTab : Color[];
public var colorDispo : boolean[];

var playerArray : Transform[];

@RPC
function GenerateMap()
{
	var xTranslate : float = 0;
	var zTranslate : float = 0;
	var i = 0;
	//board = new GameObject();
	//board.name = "Board";
	for ( var x : int = 0; x < board_size_x_; x+=10 )
	{
		for ( var z : int = 0; z < board_size_x_; z+=10 )
		{
			var tile : Transform = Network.Instantiate(tile_prefab_, Vector3(x+5,-0.5,z+5), Quaternion.identity, 0);
			tile.name = "Tile" + x + "," + z;
			tile.renderer.material.color = Color.black;
			tile.parent = GameObject.Find("mapBoard").transform;
			i++;
		}
	}
}
@RPC
function GenerateWall()
{
	var nbObject : int = board_size_x_ / 12;
	var xTranslate : float = 0;
	var zTranslate : float = 0;
	var yRotate : float = 0;
	//wBoard = new GameObject();
	//wBoard.name = "WallBoard";
	
	for (var i : int = 0; i < nbObject; i++)
	{
		var wall : Transform;
		yRotate = Random.Range(0, 180);
		wallPref.transform.localScale.x = Mathf.Round(Random.Range(10, board_size_x_ / 10));
		wallPref.transform.localScale.y = 20;
		wallPref.transform.localScale.z = 1;
		xTranslate = Mathf.Round(Random.Range(wallPref.transform.localScale.x / 2, board_size_x_ - wallPref.transform.localScale.x / 2));
		zTranslate = Mathf.Round(Random.Range(wallPref.transform.localScale.x / 2, board_size_x_ - wallPref.transform.localScale.x / 2));
		wall = Network.Instantiate(wallPref, Vector3(xTranslate, 10, zTranslate), Quaternion.Euler(0.0, yRotate, 0.0), 0);
		wall.name = "Wall" + i;
		wall.parent = GameObject.Find("wallBoard").transform;
	}
}
@RPC
function GenerateBlackHole()
{
	var nbObject : int = board_size_x_ / 100;
	var xTranslate : float = 0;
	var zTranslate : float = 0;
	//bhBoard = new GameObject();
	//bhBoard.name = "BlackHoleBoard";
	
	for (var i : int =0; i < nbObject; i++)
	{
		var blackHole : Transform;
		xTranslate = Mathf.Round(Random.Range(30, board_size_x_ - 30));
		zTranslate = Mathf.Round(Random.Range(30, board_size_x_ - 30));
		blackHole = Network.Instantiate(blackHolePref, Vector3(xTranslate, 3, zTranslate), Quaternion.identity, 0);
		blackHole.name = "BlackHole" + i;
		blackHole.parent = GameObject.Find("blackholeBoard").transform;
	}
}
@RPC
function GenerateBonus()
{
	var nbObject : int = board_size_x_ / 14;
	var xTranslate : float = 0;
	var zTranslate : float = 0;
	//bBoard  = new GameObject();
	//bBoard.name = "BonusBoard";

	for (var i : int =0; i < nbObject; i++)
	{
		var bonus : Transform;
		xTranslate = Mathf.Round(Random.Range(20, board_size_x_ - 20));
		zTranslate = Mathf.Round(Random.Range(20, board_size_x_ - 20));
		bonus = Network.Instantiate(bonusPref, Vector3(xTranslate, 3, zTranslate), Quaternion.identity, 0);
		bonus.name = "Bonus" + i;
		bonus.parent = GameObject.Find("bonusBoard").transform;
	}
}
@RPC
function GenerateFinish()
{
	var xTranslate : float = 0;
	var zTranslate : float = 0;
	xTranslate = Mathf.Round(Random.Range(board_size_x_ / 2 - 40, board_size_x_ / 2 + 40));
	zTranslate = Mathf.Round(Random.Range(board_size_x_ / 2 - 40, board_size_x_ / 2 + 40));

	finish = Network.Instantiate(finishPref, Vector3(xTranslate, 3, zTranslate), Quaternion.identity, 0);
	finish.name = "Finish";
	finish.parent = GameObject.Find("finishBoard").transform;
}

@RPC
function GeneratePlayerPosition()
{
	var playerArray : GameObject[] = GameObject.FindGameObjectsWithTag("Player");

	for (var i = 0; i < playerArray.length; i++)
	{
		playerArray[i].transform.position.x = Random.Range(15, board_size_x_ - 15);
		playerArray[i].transform.position.z = Random.Range(15, board_size_x_ - 15);
	}
}

@RPC
function GenerateSpawnPoint()
{
	GameObject.Find("SpawnPoint1").transform.position.x = 20;
	GameObject.Find("SpawnPoint1").transform.position.z = 20;
	GameObject.Find("SpawnPoint2").transform.position.x = 20;
	GameObject.Find("SpawnPoint2").transform.position.z = board_size_x_ - 20;
	GameObject.Find("SpawnPoint3").transform.position.x = board_size_x_ - 20;
	GameObject.Find("SpawnPoint3").transform.position.z = board_size_x_ - 20;
	GameObject.Find("SpawnPoint4").transform.position.x = board_size_x_ - 20;
	GameObject.Find("SpawnPoint4").transform.position.z = 20;
}

function StartNextRound(message : GameObject)
{
	var mapC : NetworkBehavior = GameObject.Find("NetworkManager").gameObject.GetComponent(NetworkBehavior);
	mapC.nbRound += 1;
	if (mapC.nbRound == 3)
		Debug.Log("FINISH");
	var i = 0;
	while (GameObject.Find("BlackHole"+i))
	{
		Network.Destroy(GameObject.Find("BlackHole"+i));
		i++;
	}
	i = 0;
	while (GameObject.Find("Wall"+i))
	{
		Network.Destroy(GameObject.Find("Wall"+i));
		i++;
	}
	i = 0;
	while (GameObject.Find("Bonus"+i))
	{
		Network.Destroy(GameObject.Find("Bonus"+i));
		i++;
	}

	networkView.RPC("GenerateBlackHole", RPCMode.All);
	networkView.RPC("GenerateBonus", RPCMode.All);
	networkView.RPC("GenerateWall", RPCMode.All);
	networkView.RPC("GenerateFinish", RPCMode.All);
	networkView.RPC("GeneratePlayerPosition", RPCMode.All);
	
	message.guiText.text = "";
}

function FinishRace(player : GameObject)
{
	var i : int = 0;
	var cd : int;
	var message : GameObject = GameObject.Find("FinishMessage");

	message.guiText.text = player.name + " HAS WIN";
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

function InitTab()
{
	colorDispo = new boolean[4];
	colorDispo[0] = true;
	colorDispo[1] = true;
	colorDispo[2] = true;
	colorDispo[3] = true;
	colorTab = new Color[4];
	colorTab[0] = Color.red;
	colorTab[1] = Color.green;
	colorTab[2] = Color.blue;
	colorTab[3] = Color.yellow;
	playerArray = new Transform[4];
}

@RPC
function InitializeGame()
{
	GameObject.Find("WallS").transform.localScale.x = board_size_x_;
	GameObject.Find("WallN").transform.localScale.x = board_size_x_;
	GameObject.Find("WallO").transform.localScale.x = board_size_x_;
	GameObject.Find("WallE").transform.localScale.x = board_size_x_;

	GameObject.Find("WallS").transform.position.x = board_size_x_ / 2;
	GameObject.Find("WallN").transform.position.x = board_size_x_ / 2;
	GameObject.Find("WallN").transform.position.z = board_size_x_;
	GameObject.Find("WallE").transform.position.x = board_size_x_;
	GameObject.Find("WallE").transform.position.z = board_size_x_ / 2;
	GameObject.Find("WallO").transform.position.z = board_size_x_ / 2;

	networkView.RPC("GenerateMap", RPCMode.All);
	networkView.RPC("GenerateBlackHole", RPCMode.All);
	networkView.RPC("GenerateBonus", RPCMode.All);
	networkView.RPC("GenerateWall", RPCMode.All);
	networkView.RPC("GenerateFinish", RPCMode.All);
	networkView.RPC("GenerateSpawnPoint", RPCMode.All);
	GameObject.Find("Map light").transform.position.x = board_size_x_ / 2;
	GameObject.Find("Map light").transform.position.z = board_size_x_ / 2;
	InitTab();
}

function SpawnPlayer()
{
	var networkC : NetworkBehavior = GameObject.Find("NetworkManager").GetComponent(NetworkBehavior);
	Debug.Log(networkC.colorTab.length);

	for (var i = 0; i < networkC.colorTab.length; i++)
	{
		if (networkC.colorDispo[i] == true)
		{
			Debug.Log("DISPO " + i);
			var spawn : GameObject = GameObject.Find("SpawnPoint" + (i + 1));
			var player : Transform = Network.Instantiate(playerPref, spawn.transform.position, Quaternion.identity, 0);
			var playerC : CharacterMove = player.gameObject.GetComponent(CharacterMove);
			player.renderer.material.color = networkC.colorTab[i];
			networkC.colorDispo[i] = false;
			playerC.id = i + 1;
			player.name = "Player" + playerC.id;
			playerArray[i] = player;
			break;
		}
	}
}

@RPC
function RequestValue()
{
	networkView.RPC("SendDispoValue", RPCMode.Server, colorDispo);
	networkView.RPC("SendColorValue", RPCMode.Server, colorTab);
	networkView.RPC("SendCurrentPlayer", RPCMode.Server, currentPlayer);
	networkView.RPC("SendMapBoard", RPCMode.Server, GameObject.Find("mapBoard").networkView.viewID);
	networkView.RPC("SendWallBoard", RPCMode.Server, GameObject.Find("wallBoard").networkView.viewID);
	networkView.RPC("SendBonusBoard", RPCMode.Server, GameObject.Find("bonusBoard").networkView.viewID);
	networkView.RPC("SendBlackHoleBoard", RPCMode.Server, GameObject.Find("blackholeBoard").networkView.viewID);
	networkView.RPC("SendFinish", RPCMode.Server, GameObject.Find("finishBoard").networkView.viewID);
	networkView.RPC("SendPlayerArray", RPCMode.Server, playerArray);
}

@RPC
function SendPlayerArray(SplayerArray : Transform[])
{
	playerArray = SplayerArray;
}

@RPC
function SendMapBoard(Sboard : NetworkViewID)
{
	GameObject.Find("mapBoard").networkView.viewID = Sboard;
}

@RPC
function SendWallBoard(SwBoard : NetworkViewID)
{
	GameObject.Find("wallBoard").networkView.viewID = SwBoard;
}

@RPC
function SendBonusBoard(SbBoard : NetworkViewID)
{
	GameObject.Find("bonusBoard").networkView.viewID = SbBoard;
}

@RPC
function SendBlackHoleBoard(SbhBoard : NetworkViewID)
{
	GameObject.Find("blackholeBoard").networkView.viewID = SbhBoard;
}

@RPC
function SendFinish(Sfinish : NetworkViewID)
{
	GameObject.Find("finishBoard").networkView.viewID = Sfinish;
}

@RPC
function SendCurrentPlayer(nbPlayer : int)
{
	currentPlayer = nbPlayer;
}

@RPC
function SendDispoValue(colorD : boolean[])
{
	colorDispo = colorD;
}

@RPC
function SendColorValue(colorT : Color[])
{
	colorTab = colorT;
}

function StartServer()
{
	Network.InitializeServer(32, 25001, !Network.HavePublicAddress);
	MasterServer.RegisterHost(gameName, "ColoRacing Game", "This is ColoRacing");
}

function Update()
{
	if (refreshing)
	{
		if (MasterServer.PollHostList().Length > 0)
		{
			refreshing = false;
			hostData = MasterServer.PollHostList();
		}
	}
}

function RefreshHostList()
{
	MasterServer.RequestHostList(gameName);
	refreshing = true;
}

function OnServerInitialized()
{
	Debug.Log("INIT");
	currentPlayer++;
	networkView.RPC("InitializeGame", RPCMode.All);
	yield WaitForSeconds(0.5);
	SpawnPlayer();
	/*SpawnPlayer();
	SpawnPlayer();
	SpawnPlayer();*/
}

function OnConnectedToServer()
{
	Debug.Log("CONNECTED");
	networkView.RPC("RequestValue", RPCMode.Server);
	yield WaitForSeconds(0.5);
	SpawnPlayer();
}

function OnPlayerConnected(player : NetworkPlayer)
{
	currentPlayer++;
}

function OnPlayerDisconnected(player : NetworkPlayer)
{
	/*var networkC : NetworkBehavior = GetComponent(NetworkBehavior);
	var playerC : CharacterMove = player.GetComponent(CharacterMove);
	networkC.colorDispo[playerC.id] = true;
	Network.Destroy(GameObject.Find("Player"+playerC.id));*/
}

function OnGUI()
{
	if (Network.peerType == NetworkPeerType.Disconnected)
	{
			if (hostData)
				Debug.Log(hostData.length);
			Debug.Log(refreshing);

			board_size_ = GUI.TextField(new Rect(120,100,100,30), board_size_);
			IPServer = GUI.TextField(new Rect(120,170,100,30), IPServer);
			//MaxPlayer = GUI.TextField(new Rect(230,100,100,30), MaxPlayer);
			if (GUI.Button (new Rect(10,100,100,30),"Start Server") && board_size_ != "Map size"/* && MaxPlayer != "Max player"*/)
			{
				board_size_x_ = parseInt(board_size_);
				//maxPlayer = parseInt(MaxPlayer);
				StartServer();
			}
			/*if (GUI.Button (new Rect(10,170,100,30),"Refresh Host"))
			{
				RefreshHostList();
			}
			/*if (hostData)
			{
				for (var i = 0; i < hostData.length; i++)
					if (GUI.Button (new Rect(150,170,150,30), hostData[i].gameName))
					{
						Debug.Log(hostData[i].ip);
						Network.Connect(hostData[i]);
					}
			}*/
			if (GUI.Button (new Rect(10,170,100,30),"Connect"))
			{
				Network.Connect(IPServer, 25001);
			}
	}
	else
	{
		if (GUI.Button (new Rect(10,10,100,30),"Exit"))
	  	{
	  		if(Network.isServer)
	  		{
	  			Destroy(GameObject.Find("WallBoard"));
				Destroy(GameObject.Find("BonusBoard"));
				Destroy(GameObject.Find("PlayerBoard"));
				Destroy(GameObject.Find("BlackHoleBoard"));
				Destroy(GameObject.Find("Finish"));
				Destroy(GameObject.Find("Board"));
  			}
  			else if (Network.isClient)
  			{
  				/*var networkC : NetworkBehavior = GetComponent(NetworkBehavior);
				var playerC : CharacterMove = GetComponent(CharacterMove);
				networkC.colorDispo[playerC.id] = true;
				Network.Destroy(playerC.viewID);*/
				Debug.Log("Client Quit");
  			}
  			Network.Disconnect();
   			Application.Quit();
 		}
		if(Network.isServer)
		{
			IPServ = Network.player.ipAddress;
			GUI.Label(new Rect(10,50,100,50),"IP to be used: "+IPServ );
		}
 	}
}
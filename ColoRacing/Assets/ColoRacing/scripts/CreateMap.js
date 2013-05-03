var wallPref:Transform;
var bonusPref:Transform;
var blackHolePref:Transform;
var finishPref:Transform;
var playerPref:Transform;
var tile_prefab_ : Transform;
var board_size_x_ : int;
var board_size_z_ : int;

var nbRound : int = 0;


function Start () 
{
		GameObject.Find("Wall1").transform.localScale.x = board_size_x_;
		GameObject.Find("Wall2").transform.localScale.x = board_size_x_;
		GameObject.Find("Wall3").transform.localScale.x = board_size_x_;
		GameObject.Find("Wall4").transform.localScale.x = board_size_x_;
		
		GameObject.Find("Wall1").transform.position.x = board_size_x_ / 2;
		GameObject.Find("Wall2").transform.position.x = board_size_x_ / 2;
		GameObject.Find("Wall2").transform.position.z = board_size_z_;
		GameObject.Find("Wall3").transform.position.x = board_size_x_;
		GameObject.Find("Wall3").transform.position.z = board_size_z_ / 2;
		GameObject.Find("Wall4").transform.position.z = board_size_z_ / 2;

		GenerateMap();
		GenerateBlackHole();
		GenerateBonus();
		GenerateWall();
		GenerateFinish();
		GeneratePlayerSpawn();
		GameObject.Find("Map light").transform.position.x = board_size_x_ / 2;
		GameObject.Find("Map light").transform.position.z = board_size_z_ / 2;
		GameObject.Find("BonusMessage").SetActive(true);
}

function GenerateMap()
{
	var xTranslate : float = 0;
	var zTranslate : float = 0;
	var board : GameObject = new GameObject();
	board.name = "Board";
	for ( var x : int = 0; x < board_size_x_; x+=10 )
	{
		for ( var z : int = 0; z < board_size_z_; z+=10 )
		{
			var tile : Transform = Instantiate(tile_prefab_, Vector3(x+5,-0.5,z+5), Quaternion.identity);
			tile.name = "Tile" + x + "," + z;
			tile.renderer.material.color = Color.black;
			tile.parent = board.transform;
		}
	}
}

function GenerateWall()
{
	var nbObject : int = board_size_x_ / 12;
	var xTranslate : float = 0;
	var zTranslate : float = 0;
	var yRotate : float = 0;
	var wBoard : GameObject = new GameObject();
	wBoard.name = "WallBoard";
	
	for (var i : int = 0; i < nbObject; i++)
	{
		var wall : Transform;
		yRotate = Random.Range(0, 180);
		wallPref.transform.localScale.x = Random.Range(20, 100);
		wallPref.transform.localScale.y = 20;
		wallPref.transform.localScale.z = 1;
		xTranslate = Random.Range(wallPref.transform.localScale.x / 2, board_size_x_ - wallPref.transform.localScale.x / 2);
		zTranslate = Random.Range(wallPref.transform.localScale.x / 2, board_size_z_ - wallPref.transform.localScale.x / 2);
		wall = Instantiate(wallPref, Vector3(xTranslate, 10, zTranslate), Quaternion.Euler(0.0, yRotate, 0.0));
		wall.name = "Wall" + xTranslate + "," + zTranslate;
		wall.parent = wBoard.transform;
	}
}

function GenerateBlackHole()
{
	var nbObject : int = board_size_x_ / 100;
	var xTranslate : float = 0;
	var zTranslate : float = 0;
	var bhBoard : GameObject = new GameObject();
	bhBoard.name = "BlackHoleBoard";
	
	for (var i : int =0; i < nbObject; i++)
	{
		var blackHole : Transform;
		xTranslate = Random.Range(30, board_size_x_ - 30);
		zTranslate = Random.Range(30, board_size_z_ - 30);
		blackHole = Instantiate(blackHolePref, Vector3(xTranslate, 3, zTranslate), Quaternion.identity);
		blackHole.name = "BlackHole" + xTranslate + "," + zTranslate;
		blackHole.parent = bhBoard.transform;
	}
}

function GenerateFinish()
{
	var xTranslate : float = 0;
	var zTranslate : float = 0;
	xTranslate = Random.Range(board_size_x_ / 2 - 40, board_size_x_ / 2 + 40);
	zTranslate = Random.Range(board_size_z_ / 2 - 40, board_size_z_ / 2 + 40);

	var finish;
	finish = Instantiate(finishPref, Vector3(xTranslate, 3, zTranslate), Quaternion.identity);
	finish.name = "Finish" + xTranslate + "," + zTranslate;
}

function GenerateBonus()
{
	var nbObject : int = board_size_x_ / 14;
	var xTranslate : float = 0;
	var zTranslate : float = 0;
	var bBoard : GameObject = new GameObject();
	bBoard.name = "BonusBoard";

	for (var i : int =0; i < nbObject; i++)
	{
		var bonus : Transform;
		xTranslate = Random.Range(20, board_size_x_ - 20);
		zTranslate = Random.Range(20, board_size_z_ - 20);
		bonus = Instantiate(bonusPref, Vector3(xTranslate, 3, zTranslate), Quaternion.identity);
		bonus.name = "Bonus" + xTranslate + "," + zTranslate;
		bonus.parent = bBoard.transform;
	}
}

function GeneratePlayerSpawn()
{
	var xTranslate : float = 0;
	var zTranslate : float = 0;
	var pBoard : GameObject = new GameObject();
	pBoard.name = "PlayerBoard";

	for (var i : int =0; i < 1; i++)
	{
		var player : Transform;
		xTranslate = Random.Range(10, board_size_x_ / 5);
		zTranslate = Random.Range(10, board_size_z_ / 5);
		player = Instantiate(playerPref, Vector3(xTranslate, 10, zTranslate), Quaternion.identity);
		player.name = "Player" + " " + i;
		player.parent = pBoard.transform;
	}
}


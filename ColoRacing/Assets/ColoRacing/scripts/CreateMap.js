var wallPref:Transform;
var bonusPref:Transform;
var blackHolePref:Transform;
var finishPref:Transform;
var tile_prefab_ : Transform;
var board_size_x_ : int;
var board_size_z_ : int;


function Start () {

		var finish;
		var i : int = 0;
		var xTranslate : float = 0;
		var zTranslate : float = 0;
		var yRotate : float = 0;
		var bhBoard : GameObject = new GameObject();
		bhBoard.name = "BlackHoleBoard";
		var bBoard : GameObject = new GameObject();
		bBoard.name = "BonusBoard";
		var wBoard : GameObject = new GameObject();
		wBoard.name = "WallBoard";
		
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

		while (i < 20)
		{
			var blackHole : Transform;
			var bonus : Transform;
			var wall : Transform;
			yRotate = Random.Range(0, 90);
			xTranslate = Random.Range(0, board_size_x_ - 10);
			zTranslate = Random.Range(0, board_size_z_ - 10);
			wallPref.transform.localScale.x = 50;
			wallPref.transform.localScale.y = 20;
			wallPref.transform.localScale.z = 1;
			wall = Instantiate(wallPref, Vector3(xTranslate, 10, zTranslate), Quaternion.Euler(0.0, yRotate, 0.0));
			wall.name = "Wall" + xTranslate + "," + zTranslate;
			wall.parent = wBoard.transform;
			
			xTranslate = Random.Range(0, board_size_x_ - 10);
			zTranslate = Random.Range(0, board_size_z_ - 10);
			bonus = Instantiate(bonusPref, Vector3(xTranslate, 3, zTranslate), Quaternion.identity);
			bonus.name = "Bonus" + xTranslate + "," + zTranslate;
			bonus.parent = bBoard.transform;
			
			xTranslate = Random.Range(0, board_size_x_ - 10);
			zTranslate = Random.Range(0, board_size_z_ - 10);
			blackHole = Instantiate(blackHolePref, Vector3(xTranslate, 3, zTranslate), Quaternion.identity);
			blackHole.name = "BlackHole" + xTranslate + "," + zTranslate;
			blackHole.parent = bhBoard.transform;
			++i;
		}
	
		xTranslate = Random.Range(0, board_size_x_ - 10);
		zTranslate = Random.Range(0, board_size_z_ - 10);
		finish = Instantiate(finishPref, Vector3(xTranslate, 3, zTranslate), Quaternion.identity);

	
		// Use this for initialization
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

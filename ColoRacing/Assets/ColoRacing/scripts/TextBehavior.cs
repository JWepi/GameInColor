using UnityEngine;
using System.Collections;

public class TextBehavior : MonoBehaviour {
	
	public bool isQuit = false;
	public UnityEngine.Color color;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnMouseEnter()
	{
		//change text color
		this.color = renderer.material.color;
		renderer.material.color = Color.black;
	}
	
	void OnMouseExit()
	{
		//reset color
		renderer.material.color = this.color;
	}
	
	void OnMouseUp()
	{
		//quit button ?
		if (isQuit)
		{
			//quit
			Application.Quit();
		}
	}
}

var text : GUIText;

function OnMouseUp()
{
	var ipString = "";
	var pos : int;
	
	pos = text.text.LastIndexOf(' ');
	ipString = text.text.Substring(pos + 1);
	text.text = "Enter IP : ";
}
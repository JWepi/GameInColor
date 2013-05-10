function Awake()
{
	if (networkView.isMine)
	{
		enabled = true;
	}
	else
	{
		enabled = false;
	}
}
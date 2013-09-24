function DoForward()
{
    Workflow.Forward(arguments.array);
}

function DoBack()
{
    Workflow.Back();
}

function DoCommit()
{
    Workflow.Commit();
}

function DoRollback()
{
    Workflow.Rollback();
}

function DoAction()
{
    var arr = arguments.array;
    Workflow.Action(arr.shift(), arr);
}

function DoRefresh()
{ 
    Workflow.Refresh(arguments.array);
}
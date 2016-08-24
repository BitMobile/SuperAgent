function SaveAndBackGoal(){
  var MeropObj = $.workflow.visit.FactMerop.GetObject();
  MeropObj.GoalContains = $.TextForGoalContains.Text;
  MeropObj.Save();
  DoBack();
}

function PlanVisitsKPI(){
	var executed = Indicators.GetCommitedScheduledVisits();
	var planned = Indicators.GetPlannedVisits();
	return String.Format("{0:F0}", (executed * 100 / planned) || 0);
}
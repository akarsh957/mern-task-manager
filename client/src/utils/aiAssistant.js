export const getAISuggestion = (tasks, userMessage) => {
  if (!tasks || tasks.length === 0) {
    return "You don’t have any tasks yet. Add one to get started 🚀";
  }

  const pending = tasks.filter(t => t.status === "Pending");
  const highPriority = tasks.filter(
    t => t.priority === "High" && t.status === "Pending"
  );

  if (userMessage.toLowerCase().includes("what should i do")) {
    if (highPriority.length > 0) {
      return `Focus on "${highPriority[0].title}" first. It’s high priority 🔥`;
    }
    return `You have ${pending.length} pending tasks. Pick one and start now 💪`;
  }

  if (userMessage.toLowerCase().includes("overwhelmed")) {
    return "Break tasks into smaller steps. Complete just ONE task now ✅";
  }

  if (pending.length > 5) {
    return "You have many pending tasks. Consider prioritizing the top 3 🎯";
  }

  return "Stay consistent! Small progress daily beats burnout 🌱";
};

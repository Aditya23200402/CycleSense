
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays } from "date-fns";
import { Bell, Calendar, Info, Settings } from "lucide-react";

// Sample notification data
const notifications = [
  {
    id: 1,
    type: "prediction",
    title: "Period Starting Soon",
    message: "Your period is predicted to start in 3 days. Prepare accordingly.",
    date: subDays(new Date(), 1),
    read: false
  },
  {
    id: 2,
    type: "educational",
    title: "Follicular Phase",
    message: "You're currently in your follicular phase. This is a good time for high-intensity workouts.",
    date: subDays(new Date(), 3),
    read: true
  },
  {
    id: 3,
    type: "reminder",
    title: "Log Your Symptoms",
    message: "Don't forget to log your symptoms for today to improve prediction accuracy.",
    date: subDays(new Date(), 5),
    read: true
  },
  {
    id: 4,
    type: "prediction",
    title: "Ovulation Approaching",
    message: "Your fertile window begins tomorrow. If you're planning pregnancy, this is an optimal time.",
    date: subDays(new Date(), 14),
    read: true
  },
  {
    id: 5,
    type: "educational",
    title: "Understanding PMS",
    message: "Learn about managing premenstrual symptoms through diet and exercise.",
    date: subDays(new Date(), 20),
    read: true
  }
];

const Notifications = () => {
  const renderIcon = (type: string) => {
    switch (type) {
      case "prediction":
        return <Calendar className="h-5 w-5 text-cycle-purple" />;
      case "educational":
        return <Info className="h-5 w-5 text-cycle-blue" />;
      case "reminder":
        return <Bell className="h-5 w-5 text-cycle-peach" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  const unread = notifications.filter(n => !n.read);
  const allNotifications = [...notifications];
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-gray-600">
          Stay informed about your cycle and health insights
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your Notifications</h2>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none p-0">
              <TabsTrigger value="all" className="rounded-none py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-cycle-purple data-[state=active]:shadow-none">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="rounded-none py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-cycle-purple data-[state=active]:shadow-none">
                Unread ({unread.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="p-0 m-0">
            <ScrollArea className="h-[500px]">
              {allNotifications.length > 0 ? (
                <div className="divide-y">
                  {allNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 ${notification.read ? '' : 'bg-cycle-purple-light/20'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{renderIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={`font-medium ${notification.read ? '' : 'text-cycle-purple-dark'}`}>
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {format(notification.date, 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                    <p className="text-gray-500">You don't have any notifications at the moment.</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread" className="p-0 m-0">
            <ScrollArea className="h-[500px]">
              {unread.length > 0 ? (
                <div className="divide-y">
                  {unread.map((notification) => (
                    <div 
                      key={notification.id} 
                      className="p-4 hover:bg-gray-50 bg-cycle-purple-light/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{renderIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-cycle-purple-dark">
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {format(notification.date, 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No unread notifications</h3>
                    <p className="text-gray-500">You've read all your notifications.</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;

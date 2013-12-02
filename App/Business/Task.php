<?php
/**
 *
 */

namespace TaskManagement\Business;

class Task {

    public function findAll() {
    }

    public function find($id) {
    }

    public static function destroy($id) {
    }

    public static function createOrUpdate($data) {
        if (isset($data["id"]))
            $task = \TaskManagement\Task::find($data["id"]);
        else
            $task = null;

        if (!is_object($task)) {
            $task = new \TaskManagement\Task();
            $task->setOwner(\User::current_user());
        }

        $task->setName($data["name"]);
        unset($data["name"]);
        if (isset($data["description"])) {
            $task->setDescription($data["description"]);
            unset($data["description"]);
        }

        unset($data["owner"]);
        unset($data["id"]);

        if (isset($data["participants"]) && is_array($data["participants"])) {
            $task->getParticipants()->clear();
            foreach ($data["participants"] as $parray) {
                $user = \User::find($parray["id"]);
                if (is_object($user)) {
                    if (!$task->getParticipants()->contains($user))
                        $task->getParticipants()->add($user);
                }
            }
        }
        unset($data["participants"]);

        if (isset($data["events"]) && is_array($data["events"])) {
            $task->getEvents()->clear();
            foreach ($data["events"] as $evarray) {
                $event = \Time\Event::find($evarray["id"]);
                if (is_object($event)) {
                    if (!$task->getEvents()->contains($event))
                        $task->getEvents()->add($event);
                }
            }
        }
        unset($data["events"]);

        $event_data = $data;
        $data_array = $task->getData();

        if (is_array($event_data)) {
            foreach ($event_data as $key => $d) {
                $data_array[$key] = $d;
            }
        }

        foreach ($data_array as $key => $d) {
            if (!isset($event_data[$key])) {
                unset($data_array[$key]);
            }
        }
        $task->setData($data_array);
        $task->save();

        return $task;
    }
}
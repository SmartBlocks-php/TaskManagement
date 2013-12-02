<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 10/16/13
 * Time: 11:04 PM
 */

namespace TaskManagement;

class TaskController extends \Controller {
    public function before_filter() {
        \User::restrict();
    }

    public function index() {
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        $qb->select('e')->from('\TaskManagement\Task', 'e')
           ->leftJoin('e.participants', 'p')
           ->where('e.owner = :user OR p = :user')
           ->setParameter('user', \User::current_user());

        $results = $qb->getQuery()->getResult();
        $response = array();
        foreach ($results as $result) {
            $response[] = $result->toArray();
        }
        $this->return_json($response);
    }

    public function show($params = array()) {
        if (isset($params["id"])) {
            $task = \TaskManagement\Task::find($params["id"]);
            if (is_object($task)) {
                $this->return_json($task->toArray());
            } else {
                $this->json_error("This task does not exist", 404);
            }
        } else {
            $this->json_error("This task does not exist", 404);
        }
    }

    public function create() {
        $data = $this->getRequestData();
        $this->return_json(\TaskManagement\Business\Task::createOrUpdate($data)->toArray());
    }

    public function update($data = array()) {

        $id = $data["id"];
        $data = $this->getRequestData();

        if (isset($data["id"]))
            $task = Task::find($data["id"]);
        else
            $task = null;
        if (is_object($task)) {
            if ($task->getOwner() == \User::current_user() || $task->getParticipants()->contains(\User::current_user())) {
                $this->return_json(\TaskManagement\Business\Task::createOrUpdate($data)->toArray());
            }
            else {
                $this->json_error("This task does not exist", 404);
            }
        }
        else {
            $this->json_error("This task does not exist", 404);
        }
    }

    public function destroy($data = array()) {
        $task = Task::find($data["id"]);
        if (is_object($task)) {
            if ($task->getOwner() == \User::current_user() || $task->getParticipants()->contains(\User::current_user())) {
                $task->delete();
                $this->json_message("Successfully deleted task");
            }
            else {
                $this->json_error("This task does not exist", 404);
            }
        }
        else {
            $this->json_error("This event does not exist", 404);
        }
    }
}
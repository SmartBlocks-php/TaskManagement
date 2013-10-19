<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 10/16/13
 * Time: 11:04 PM
 */

namespace TaskManagement;

class TaskController extends \Controller
{
    public function before_filter()
    {
        \User::restrict();
    }


    public function index()
    {
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        $qb->select('e')->from('\TaskManagement\Task', 'e')->where('e.owner = :user')
            ->setParameter('user', \User::current_user());

        $results = $qb->getQuery()->getResult();
        $response = array();
        foreach ($results as $result)
        {
            $response[] = $result->toArray();
        }
        $this->return_json($response);
    }

    private function createOrUpdate($data)
    {
        if (isset($data["id"]))
            $task = Task::find($data["id"]);
        else
            $task = null;

        if (!is_object($task))
        {
            $task = new Task();
        }

        $task->setOwner(\User::current_user());

        $task->setName($data["name"]);
        unset($data["name"]);
        if (isset($data["description"]))
        {
            $task->setDescription($data["description"]);
            unset($data["description"]);
        }

        unset($data["owner"]);
        unset($data["id"]);

        $event_data = $data;
        $data_array = $task->getData();

        if (is_array($event_data))
        {
            foreach ($event_data as $key => $d)
            {
                $data_array[$key] = $d;
            }

        }

        foreach ($data_array as $key => $d)
        {
            if (!isset($event_data[$key])) {
                unset($data_array[$key]);
            }
        }
        $task->setData($data_array);
        $task->save();

        return $task->toArray();
    }

    public function create()
    {
        $data = $this->getRequestData();
        $this->return_json($this->createOrUpdate($data));
    }

    public function update($data = array())
    {

        $id = $data["id"];
        $data = $this->getRequestData();

        if (isset($data["id"]))
            $task = Task::find($data["id"]);
        else
            $task = null;
        if (is_object($task))
        {
            if ($task->getOwner() == \User::current_user())
            {
                $this->return_json($this->createOrUpdate($data));
            }
            else
            {
                $this->json_error("This task does not exist", 404);
            }
        }
        else
        {
            $this->json_error("This task does not exist", 404);
        }
    }


    public function destroy($data = array())
    {
        $task = Task::find($data["id"]);
        if (is_object($task))
        {
            if ($task->getOwner() == \User::current_user())
            {
                $task->delete();
                $this->json_message("Successfully deleted task");
            }
            else
            {
                $this->json_error("This task does not exist", 404);
            }
        }
        else
        {
            $this->json_error("This event does not exist", 404);
        }
    }

}